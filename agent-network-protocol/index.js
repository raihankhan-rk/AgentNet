import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { yamux } from "@chainsafe/libp2p-yamux";
import { identify } from '@libp2p/identify';
import { kadDHT } from '@libp2p/kad-dht';
import { noise } from "@libp2p/noise";
import { tcp } from "@libp2p/tcp";
import axios from "axios";
import { createLibp2p } from "libp2p";
import { SystemAgent } from './agents/SystemAgent.js';
import { UserAgent } from './agents/UserAgent.js';
import { getProtocolTools } from './tools.js';

export default class AgentNetworkProtocol {
    constructor() {
        this.registrarUrl = 'http://localhost:3000';
        this.messageHandlers = new Map();
        this.pendingResponses = new Map();
        this.nodes = new Map();
        this.systemAgents = new Map();
        this.userAgents = new Map();
    }

    async initialize() {
        this.baseConfig = {
            addresses: {
                listen: ['/ip4/127.0.0.1/tcp/0']
            },
            transports: [tcp()],
            connectionEncryption: [noise()],
            streamMuxers: [yamux()],
            services: {
                identify: identify(),
                pubsub: gossipsub({
                    emitSelf: true,
                    allowPublishToZeroPeers: true,
                    gossipIncoming: true,
                    fallbackToFloodsub: true,
                    floodPublish: true,
                }),
                dht: kadDHT({
                    clientMode: false,
                    pingTimeout: 5000,
                    maxInboundStreams: 5000,
                    maxOutboundStreams: 5000,
                })
            }
        };
    }

    async createNode() {
        const port = Math.floor(Math.random() * (65535 - 1024) + 1024);

        const nodeConfig = {
            ...this.baseConfig,
            addresses: {
                listen: [`/ip4/127.0.0.1/tcp/${port}`]
            }
        };

        const node = await createLibp2p(nodeConfig);
        await node.start();

        // Wait for node to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Subscribe to messages for this node
        const topic = `/agent/${node.peerId.toString()}`;
        await node.services.pubsub.subscribe(topic);

        // Set up message handler
        node.services.pubsub.addEventListener('message', (evt) => {
            if (evt.detail.topic === topic) {
                this.handleIncomingMessage(evt.detail);
            }
        });

        return node;
    }

    async deploySystemAgent(agentConfig, agentMetadata) {
        if (!this.baseConfig) {
            throw new Error('Protocol not initialized. Call initialize() first.');
        }

        const { name, description, capabilities, walletAddress } = agentMetadata;
        if (!name || !description || !capabilities) {
            throw new Error('Missing required agent metadata');
        }

        const systemAgent = new SystemAgent(agentConfig);
        await systemAgent.initialize();

        const node = await this.createNode();
        const peerId = node.peerId.toString();

        this.nodes.set(peerId, node);
        this.systemAgents.set(peerId, systemAgent);

        this.messageHandlers.set(peerId, async (message) => {
            const response = await systemAgent.handleMessage(message);
            return response;
        });

        try {
            await this._registerAgent({
                peerId,
                name,
                description,
                capabilities,
                walletAddress
            });
            console.log('Successfully registered system agent:', name, 'with peerId:', peerId);

            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.connectNodes();

        } catch (error) {
            await node.stop();
            this.nodes.delete(peerId);
            this.messageHandlers.delete(peerId);
            throw error;
        }

        return {
            peerId,
            agentMetadata
        };
    }

    async createUserAgent(agentConfig) {
        if (!this.baseConfig) {
            throw new Error('Protocol not initialized. Call initialize() first.');
        }

        const userAgent = new UserAgent(agentConfig, this);
        await userAgent.initialize();

        const node = await this.createNode();
        const peerId = node.peerId.toString();

        this.nodes.set(peerId, node);
        this.userAgents.set(peerId, userAgent);

        return userAgent;
    }

    async findAgentsByCapability(capability) {
        try {
            console.log('Protocol searching for capability:', capability);
            const response = await axios.get(
                `${this.registrarUrl}/lookup?capability=${capability}`
            );
            console.log('Protocol received response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Protocol error finding agents:', error);
            throw new Error(`Failed to find agents: ${error.message}`);
        }
    }

    async sendMessage(targetPeerId, message) {
        console.log('\n=== Sending Message ===');
        console.log('Target PeerId:', targetPeerId);
        console.log('Message:', message);

        const nodes = Array.from(this.nodes.values());
        if (nodes.length === 0) {
            throw new Error('No nodes available to send message');
        }

        let senderNode = this.nodes.get(targetPeerId);
        if (!senderNode) {
            console.log('Using fallback sender node');
            senderNode = nodes[0];
        }

        try {
            const topic = `/agent/${targetPeerId}`;
            console.log('Publishing to topic:', topic);

            const responsePromise = new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    this.pendingResponses.delete(senderNode.peerId.toString());
                    reject(new Error(`Response timeout waiting for agent ${targetPeerId}. The agent may be busy or not responding.`));
                }, 30000);

                console.log('Setting up response handler for:', senderNode.peerId.toString());
                this.pendingResponses.set(senderNode.peerId.toString(), (response) => {
                    console.log('Received response:', response);
                    clearTimeout(timeoutId);
                    resolve(response);
                });
            });

            // Ensure subscription
            if (!senderNode.services.pubsub.getTopics().includes(topic)) {
                await senderNode.services.pubsub.subscribe(topic);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Send message
            const messageData = JSON.stringify({
                to: targetPeerId,
                from: senderNode.peerId.toString(),
                content: message,
                timestamp: Date.now()
            });

            await senderNode.services.pubsub.publish(
                topic,
                new TextEncoder().encode(messageData)
            );
            console.log('Message published successfully');

            // Wait for response
            return await responsePromise;

        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }

    async handleIncomingMessage(message) {
        try {
            const data = JSON.parse(new TextDecoder().decode(message.data));
            console.log('\n=== Incoming Message ===');
            console.log('Message data:', data);
            console.log('Registered handlers:', Array.from(this.messageHandlers.keys()));
            console.log('Pending responses:', Array.from(this.pendingResponses.keys()));

            if (data.isResponse) {
                console.log('Processing response message');
                const resolver = this.pendingResponses.get(data.to);
                if (resolver) {
                    console.log('Found resolver for response');
                    resolver(data.content);
                    this.pendingResponses.delete(data.to);
                } else {
                    console.log('No resolver found for response');
                }
                return;
            }

            // Handle new requests
            console.log('Processing new request');
            const handler = this.messageHandlers.get(data.to);
            if (handler) {
                console.log('Found message handler, invoking...');
                try {
                    const response = await handler(data.content);
                    console.log('Handler response:', response);
                    if (!response) {
                        console.log('No response from handler');
                        return;
                    }

                    const receivingNode = this.nodes.get(data.to);
                    if (!receivingNode) {
                        console.log('No receiving node found');
                        return;
                    }

                    // Ensure response has isResponse flag
                    const responseData = {
                        to: data.from,
                        from: data.to,
                        content: response,
                        timestamp: Date.now(),
                        isResponse: true
                    };

                    console.log('Sending response:', responseData);
                    const responseTopic = `/agent/${data.from}`;
                    await receivingNode.services.pubsub.publish(
                        responseTopic,
                        new TextEncoder().encode(JSON.stringify(responseData))
                    );
                    console.log('Response sent successfully');
                } catch (error) {
                    console.error('Error processing message:', error);
                    // Send error response back
                    const errorResponse = {
                        to: data.from,
                        from: data.to,
                        content: { type: 'error', content: error.message },
                        timestamp: Date.now(),
                        isResponse: true
                    };
                    const receivingNode = this.nodes.get(data.to);
                    if (receivingNode) {
                        await receivingNode.services.pubsub.publish(
                            `/agent/${data.from}`,
                            new TextEncoder().encode(JSON.stringify(errorResponse))
                        );
                    }
                }
            } else {
                console.log('No handler found for message');
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    async _registerAgent(registrationData) {
        try {
            const response = await axios.post(
                `${this.registrarUrl}/register`,
                registrationData
            );
            return response.data;
        } catch (error) {
            throw new Error(`Failed to register agent: ${error.message}`);
        }
    }

    async stop() {
        for (const [peerId, node] of this.nodes) {
            await node.stop();
            this.nodes.delete(peerId);
            this.messageHandlers.delete(peerId);
        }
    }

    async connectNodes() {
        const connectedPeers = new Set();

        for (const [peerId, node] of this.nodes) {
            for (const [otherPeerId, otherNode] of this.nodes) {
                if (peerId !== otherPeerId && !connectedPeers.has(`${peerId}-${otherPeerId}`)) {
                    try {
                        const topic = `/agent/${otherPeerId}`;
                        await node.services.pubsub.subscribe(topic);

                        let connected = false;
                        let attempts = 0;
                        while (!connected && attempts < 3) {
                            try {
                                await node.dial(otherNode.peerId);
                                connected = true;
                                console.log(`Successfully connected ${peerId} to ${otherPeerId}`);
                            } catch (error) {
                                attempts++;
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }

                        connectedPeers.add(`${peerId}-${otherPeerId}`);
                        connectedPeers.add(`${otherPeerId}-${peerId}`);

                    } catch (error) {
                        console.error(`Failed to connect ${peerId} to ${otherPeerId}:`, error.message);
                    }
                }
            }
        }
    }

    getTools() {
        return getProtocolTools(this);
    }
}