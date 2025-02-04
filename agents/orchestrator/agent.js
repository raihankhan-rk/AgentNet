import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { DEFAULT_SYSTEM_PROMPT } from "./prompts.js";
import { createAgentCommunicationTool, createAgentDiscoveryTool, createMultiAgentCommunicationTool } from "./tools.js";

export class OrchestratorAgent {
    constructor(config, protocol) {
        this.config = config;
        this.protocol = protocol;
        this.agent = null;
        this.memory = new MemorySaver();
        this.ephemeralNode = null;
        this.runnableConfig = {
            configurable: {
                thread_id: "Orchestrator_Agent",
                metadata: {
                    agent_type: "orchestrator",
                },
            },
        };
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.config.model || "gpt-4o-mini",
            temperature: 0.7,
        });

        // Initialize CDP AgentKit
        const agentkit = await CdpAgentkit.configureWithWallet({
            cdpWalletData: this.config.cdpWalletData || "",
            networkId: this.config.networkId || "base-sepolia",
        });

        const tools = [
            createAgentCommunicationTool(this.protocol),
            createMultiAgentCommunicationTool(this.protocol),
            createAgentDiscoveryTool(this.protocol),
        ];

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: this.memory,
            messageModifier: this.config.systemPrompt || DEFAULT_SYSTEM_PROMPT,
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

            console.log('\n[DEBUG] Orchestrator processing message:', message);
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

            console.log('[DEBUG] Orchestrator finished processing');
            // Clear line and move cursor up for cleaner output
            process.stdout.write('\x1b[2K\r');
            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error('\n[ERROR] Orchestrator Agent error:', error);
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