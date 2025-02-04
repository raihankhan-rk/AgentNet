import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { FLIGHTY_SYSTEM_PROMPT } from "./prompts.js";
import { createBookFlightTool, createFlightSearchTool, createGetBookingsTool } from "./tools.js";

export class FlightyAgent {
    constructor(agentConfig) {
        this.agentConfig = agentConfig;
        this.agent = null;
        this.config = null;
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.agentConfig.model || "gpt-4o-mini",
            temperature: 0.7,
        });

        // Initialize CDP AgentKit
        const agentkit = await CdpAgentkit.configureWithWallet({
            cdpWalletData: this.agentConfig.cdpWalletData || "",
            networkId: this.agentConfig.networkId || "base-sepolia",
        });

        // Setup tools
        const cdpToolkit = new CdpToolkit(agentkit);
        const cdpTools = cdpToolkit.getTools();
        const customTools = [
            createFlightSearchTool(),
            createGetBookingsTool(),
            createBookFlightTool()
        ];
        const tools = [...cdpTools, ...customTools];

        // Create agent
        const memory = new MemorySaver();
        this.config = { 
            configurable: { 
                thread_id: "Flighty_Agent",
                metadata: {
                    agent_type: "flight-booking",
                },
            } 
        };

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: this.agentConfig.systemPrompt || FLIGHTY_SYSTEM_PROMPT,
        });
    }

    async handleMessage(message) {
        try {
            console.log('Flighty Agent handling message:', message);
            const stream = await this.agent.stream(
                { messages: [new HumanMessage(message)] },
                this.config
            );

            let response = "";
            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    response += chunk.agent.messages[0].content + "\n";
                } else if ("tools" in chunk) {
                    response += chunk.tools.messages[0].content + "\n";
                }
            }

            console.log('Flighty Agent response:', response);
            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error('Flighty Agent error:', error);
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
        if (!this.config) {
            throw new Error('Agent not initialized. Call initialize() first.');
        }
        return this.config;
    }
}