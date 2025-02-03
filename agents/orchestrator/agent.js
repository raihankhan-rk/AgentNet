import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { createAgentCommunicationTool, createAgentDiscoveryTool, createMultiAgentCommunicationTool } from "./tools.js";
import { DEFAULT_SYSTEM_PROMPT } from "./prompts.js";

export class OrchestratorAgent {
    constructor(config, protocol) {
        this.config = config;
        this.protocol = protocol;
        this.agent = null;
        this.memory = new MemorySaver();
        // Add default runnable config
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

    async handleMessage(message) {
        try {
            console.log('Orchestrator Agent handling message:', message);
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

            console.log('Orchestrator Agent response:', response);
            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error('Orchestrator Agent error:', error);
            return {
                type: "error",
                content: `Error processing request: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            };
        }
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