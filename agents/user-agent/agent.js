import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { DEFAULT_SYSTEM_PROMPT } from "./prompts.js";

export class UserAgent {
    constructor(agentConfig, protocol) {
        this.agentConfig = agentConfig;
        this.protocol = protocol;
        this.agent = null;
        this.config = null;
        this.ephemeralNode = null;
        this.runnableConfig = {
            configurable: {
                thread_id: "User_Agent",
                metadata: {
                    agent_type: "user",
                },
            },
        };
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.agentConfig.model || "gpt-4o-mini",
            temperature: 0.7,
        });

        // Initialize CDP AgentKit with the wallet data from config
        const agentkit = await CdpAgentkit.configureWithWallet({
            cdpWalletData: this.agentConfig.cdpWalletData || "",
            networkId: this.agentConfig.networkId || "base-sepolia",
        });

        // Update wallet address from the provided config
        this.agentConfig = {
            ...this.agentConfig,
            walletAddress: this.agentConfig.cdpWalletData ? 
                JSON.parse(this.agentConfig.cdpWalletData).defaultAddressId :
                undefined
        }

        // Setup tools
        const cdpToolkit = new CdpToolkit(agentkit);
        const cdpTools = cdpToolkit.getTools();
        const protocolTools = this.protocol.getTools(); // Get tools from protocol
        const tools = [...cdpTools, ...protocolTools];

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: new MemorySaver(),
            messageModifier: this.agentConfig.systemPrompt || DEFAULT_SYSTEM_PROMPT,
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
            await this.createEphemeralNode();

            console.log('\n[DEBUG] User Agent processing message:', message);
            const stream = await this.agent.stream(
                { messages: [new HumanMessage(message)] },
                this.runnableConfig
            );

            let response = "";
            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    response += chunk.agent.messages[0].content + "\n";
                } else if ("tools" in chunk) {
                    response += chunk.tools.messages[0].content + "\n";
                }
            }

            console.log('[DEBUG] User Agent finished processing');
            // Clear line and move cursor up for cleaner output
            process.stdout.write('\x1b[2K\r');
            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error('\n[ERROR] User Agent error:', error);
            return {
                type: "error",
                content: `Error processing request: ${error instanceof Error ? error.message : "Unknown error"
                    }`,
            };
        }
    }

    async cleanup() {
        await this.destroyEphemeralNode();
    }

    getAgent() {
        if (!this.agent) {
            throw new Error('Agent not initialized. Call initialize() first.');
        }
        return this.agent;
    }

    getConfig() {
        return this.runnableConfig;
    }

    getPendingResponses() {
        return this.protocol.pendingResponses;
    }
}