import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { createSearchHotelsTool, createGetHotelDetailsTool, createBookHotelTool, createGetBookingsTool } from "./tools.js";
import { AIRBNB_SYSTEM_PROMPT } from "./prompts.js";

export class AirbnbAgent {
    constructor(config) {
        this.config = config;
        this.agent = null;
        this.memory = new MemorySaver();
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.config.model || "gpt-4o-mini",
            temperature: 0.7,
        });

        const tools = [
            createSearchHotelsTool(),
            createGetHotelDetailsTool(),
            createBookHotelTool(),
            createGetBookingsTool()
        ];

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: this.memory,
            messageModifier: AIRBNB_SYSTEM_PROMPT,
        });
    }

    async handleMessage(message) {
        try {
            console.log('Airbnb Agent handling message:', message);
            const stream = await this.agent.stream(
                { messages: [new HumanMessage(message.content)] },
                {
                    configurable: {
                        thread_id: "Airbnb_Agent",
                        metadata: {
                            agent_type: "accommodation",
                        },
                    },
                }
            );

            let response = "";
            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    response += chunk.agent.messages[0].content + "\n";
                } else if ("tools" in chunk) {
                    response += chunk.tools.messages[0].content + "\n";
                }
            }

            console.log('Airbnb Agent response:', response);
            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error('Airbnb Agent error:', error);
            return {
                type: "error",
                content: `Error processing request: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            };
        }
    }
} 