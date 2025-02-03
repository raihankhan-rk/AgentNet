// protocol.js
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@libp2p/noise";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { identify } from '@libp2p/identify';
import { kadDHT } from '@libp2p/kad-dht';
import PeerId from 'peer-id';
import axios from "axios";

class AgentNetworkProtocol {
    constructor(registrarUrl = 'http://localhost:3000') {
        this.node = null;
        this.registrarUrl = registrarUrl;
        this.messageHandlers = new Map();
    }

    async initialize() {
        const peerId = await PeerId.create({ keyType: 'Ed25519' });;
        
        const libp2pConfig = {
            peerId,
            addresses: {
                listen: ['/ip4/0.0.0.0/tcp/0']
            },
            transports: [tcp()],
            streamMuxers: [yamux()],
            connectionEncryption: [noise()],
            services: {
                pubsub: gossipsub({
                    enabled: true,
                    emitSelf: false,
                }),
                dht: kadDHT({
                    protocol: '/agent-dht/1.0.0',
                    clientMode: false,
                }),
                identify: identify()
            }
        };

        this.node = await createLibp2p(libp2pConfig);
        
        // Setup message handling
        this.node.pubsub.subscribe('agent-messages');
        this.node.pubsub.addEventListener('message', (message) => {
            this.handleIncomingMessage(message);
        });

        return this.node;
    }

    async deployAgent(agentInstance, agentMetadata) {
        if (!this.node) {
            throw new Error('Protocol not initialized. Call initialize() first.');
        }

        const { name, description, capabilities } = agentMetadata;

        if (!name || !description || !capabilities) {
            throw new Error('Missing required agent metadata');
        }

        // Register message handler for this agent
        this.messageHandlers.set(this.node.peerId.toString(), async (message) => {
            return await agentInstance.handleMessage(message);
        });

        // Register the agent with the network
        await this._registerAgent({
            peerId: this.node.peerId.toString(),
            name,
            description,
            capabilities
        });

        // Start the libp2p node if not already started
        if (!this.node.isStarted()) {
            await this.node.start();
        }

        return {
            peerId: this.node.peerId.toString(),
            agentMetadata
        };
    }

    async findAgentsByCapability(capability) {
        try {
            const response = await axios.get(
                `${this.registrarUrl}/lookup?capability=${capability}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Failed to find agents: ${error.message}`);
        }
    }

    async sendMessage(targetPeerId, message) {
        try {
            const messageData = {
                from: this.node.peerId.toString(),
                to: targetPeerId,
                content: message,
                timestamp: Date.now()
            };

            await this.node.pubsub.publish(
                'agent-messages',
                new TextEncoder().encode(JSON.stringify(messageData))
            );
        } catch (error) {
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }

    async handleIncomingMessage(message) {
        try {
            const data = JSON.parse(new TextDecoder().decode(message.data));
            
            // Check if message is for this peer
            if (data.to === this.node.peerId.toString()) {
                const handler = this.messageHandlers.get(data.to);
                if (handler) {
                    const response = await handler(data.content);
                    if (response) {
                        // Send response back
                        await this.sendMessage(data.from, response);
                    }
                }
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
        if (this.node && this.node.isStarted()) {
            await this.node.stop();
        }
    }
}

export default AgentNetworkProtocol;