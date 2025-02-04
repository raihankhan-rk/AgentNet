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
        this.sessionId = `orchestrator_${Date.now()}`;
        this.agent = null;
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

        const agentkit = await CdpAgentkit.configureWithWallet({
            cdpWalletData: this.config.cdpWalletData || "",
            networkId: this.config.networkId || "base-sepolia",
        });

        const tools = [
            createAgentCommunicationTool(this.protocol, this.sessionId),
            createMultiAgentCommunicationTool(this.protocol, this.sessionId),
            createAgentDiscoveryTool(this.protocol),
        ];

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: new MemorySaver(),
            messageModifier: this.config.systemPrompt || DEFAULT_SYSTEM_PROMPT,
        });
    }

    async handleMessage(message) {
        try {
            // Create ephemeral node if needed for protocol communication
            if (!this.protocol.getEphemeralNode(this.sessionId)) {
                await this.protocol.createEphemeralNode(this.sessionId);
            }
            
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
            process.stdout.write('\x1b[2K\r');
            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error('\n[ERROR] Orchestrator Agent error:', error);
            return {
                type: "error",
                content: `Error processing request: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            };
        }
    }

    async cleanup() {
        await this.protocol.destroyEphemeralNode(this.sessionId);
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