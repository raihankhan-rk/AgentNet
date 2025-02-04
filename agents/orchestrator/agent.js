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
        this.llm = new ChatOpenAI({
            model: config.model || "gpt-4o-mini",
        });
        this.sessionId = null;
        this.peerId = null;
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
        // Create an ephemeral node for this session
        this.sessionId = `orchestrator_${Date.now()}`;
        this.peerId = await this.protocol.createEphemeralNode(this.sessionId);
        console.log('Orchestrator initialized with peerId:', this.peerId);

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
            llm: this.llm,
            tools,
            checkpointSaver: new MemorySaver(),
            messageModifier: this.config.systemPrompt || DEFAULT_SYSTEM_PROMPT,
        });
    }

    async handleMessage(message) {
        try {
            // Process the message with the LLM
            const response = await this.llm.invoke([new HumanMessage(message)]);
            
            // Return the response
            return {
                type: "response",
                content: response.content,
            };
        } catch (error) {
            console.error('Error in orchestrator:', error);
            return {
                type: "error",
                content: `Error processing request: ${error.message}`,
            };
        }
    }

    async cleanup() {
        if (this.sessionId) {
            await this.protocol.destroyEphemeralNode(this.sessionId);
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