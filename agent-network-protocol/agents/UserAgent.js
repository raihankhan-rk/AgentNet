import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// import { v4 as uuidv4 } from 'uuid';

export class UserAgent {
    constructor(agentConfig, protocol) {
        this.agentConfig = agentConfig;
        this.protocol = protocol;
        this.agent = null;
        this.config = null;
        this.ephemeralNode = null;
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.agentConfig.model || "gpt-4o-mini",
            temperature: 0.7,
        });

        const agentkit = await CdpAgentkit.configureWithWallet({
            cdpWalletData: this.agentConfig.cdpWalletData || "",
            networkId: this.agentConfig.networkId || "base-sepolia",
            cdpApiKeyName: this.agentConfig.cdpApiKeyName || "",
            cdpApiKeyPrivateKey: this.agentConfig.cdpApiKeyPrivateKey || "",
        });

        this.agentConfig = {
            ...this.agentConfig,
            walletAddress: this.agentConfig.cdpWalletData ? 
                JSON.parse(this.agentConfig.cdpWalletData).defaultAddressId :
                undefined
        }

        // Setup tools
        const cdpToolkit = new CdpToolkit(agentkit);
        const cdpTools = cdpToolkit.getTools();
        const protocolTools = this.protocol.getTools();
        const customTools = this.getCustomTools?.() || [];
        const tools = [...cdpTools, ...protocolTools, ...customTools];

        this.config = {
            configurable: {
                thread_id: this.agentConfig.threadId || "User_Agent",
                metadata: {
                    agent_type: "user",
                },
            },
        };

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: new MemorySaver(),
            messageModifier: this.agentConfig.systemPrompt,
        });
    }

    async createEphemeralNode() {
        if (!this.ephemeralNode) {
            console.log('\n[DEBUG] Creating new ephemeral orchestrator node...');
            this.ephemeralNode = await this.protocol.createNode();
            const peerId = this.ephemeralNode.peerId.toString();
            this.protocol.nodes.set(peerId, this.ephemeralNode);
            console.log(`[DEBUG] Ephemeral orchestrator node created with peerId: ${peerId}`);
        }
        return this.ephemeralNode;
    }

    async destroyEphemeralNode() {
        if (this.ephemeralNode) {
            const peerId = this.ephemeralNode.peerId.toString();
            console.log('\n[DEBUG] Cleaning up ephemeral orchestrator node...');
            this.protocol.nodes.delete(peerId);
            await this.ephemeralNode.stop();
            this.ephemeralNode = null;
            console.log(`[DEBUG] Ephemeral orchestrator node ${peerId} destroyed`);
        }
    }

    async handleMessage(message) {
        try {
            console.log('[DEBUG] User Agent processing message:', message);
            const stream = await this.agent.stream(
                { messages: [new HumanMessage(message)] },
                this.config
            );

            this.protocol.addChatMessage(this.agentConfig.walletAddress, {sender: "user", message: message});
    
            let response = "";
            for await (const chunk of stream) {
                if ("agent" in chunk && chunk.agent.messages[0].content) {
                    const content = chunk.agent.messages[0].content;
                    if (!content.startsWith('{') && !content.startsWith('[')) {
                        response = content;
                        this.protocol.addChatMessage(this.agentConfig.walletAddress, {sender: "agent", message: response});
                    }
                } else if ("tools" in chunk && chunk.tools.messages[0].content) {
                    const content = chunk.tools.messages[0].content;
                    if (!content.startsWith('{') && !content.startsWith('[')) {
                        response = content;
                    }
                }
            }
    
            console.log('[DEBUG] User Agent finished processing');
            return {
                type: "response",
                content: response.trim()
            };
        } catch (error) {
            console.error('[DEBUG] User Agent error:', error);
            return {
                type: "error",
                content: `Error processing request: ${error instanceof Error ? error.message : "Unknown error"}`
            };
        }
    } 

    async cleanup() {
        try {
            console.log('\n[DEBUG] Starting UserAgent cleanup...');
            await this.destroyEphemeralNode();
            
            if (this.agent) {
                const memory = this.agent.checkpointSaver;
                if (memory) {
                    await memory.clear();
                }
            }
            
            console.log('[DEBUG] UserAgent cleanup completed');
        } catch (error) {
            console.error('[ERROR] Error during UserAgent cleanup:', error);
            throw error;
        }
    }

    getAgent() {
        if (!this.agent) {
            throw new Error('Agent not initialized. Call initialize() first.');
        }
        return this.agent;
    }

    getConfig() {
        if (!this.config) {
            throw new Error('Agent not initialized. Call initialize() first.');
        }
        return this.config;
    }

    getPendingResponses() {
        return this.protocol.pendingResponses;
    }

    getCustomTools() {
        return [];
    }

    async getWalletAddress() {
        if (!this.agentConfig.walletAddress) {
            throw new Error('No wallet address available. Make sure CDP wallet is configured.');
        }
        return this.agentConfig.walletAddress;
    }

    async getNetworkId() {
        return this.agentConfig.networkId || "base-sepolia";
    }
} 