import { HumanMessage } from "@langchain/core/messages";
import { AIRBNB_SYSTEM_PROMPT } from "./prompts.js";
import { createSearchHotelsTool, createGetHotelDetailsTool, createBookHotelTool, createGetBookingsTool } from "./tools.js";

export class AirbnbAgent {
    static getTools() {
        return [
            createSearchHotelsTool(),
            createGetHotelDetailsTool(),
            createBookHotelTool(),
            createGetBookingsTool()
        ];
    }

    static get systemPrompt() {
        return AIRBNB_SYSTEM_PROMPT;
    }

    static async handleMessage(agent, message) {
        try {
            console.log('Airbnb Agent handling message:', message);
            
            // Create a simple HumanMessage with just the text content
            const humanMessage = new HumanMessage(message);

            const stream = await agent.stream(
                { messages: [humanMessage] },
                {
                    configurable: {
                        thread_id: "Airbnb_Agent",
                        metadata: {
                            agent_type: "accommodation-booking",
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