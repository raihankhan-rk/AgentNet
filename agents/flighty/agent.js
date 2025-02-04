import { HumanMessage } from "@langchain/core/messages";
import { FLIGHTY_SYSTEM_PROMPT } from "./prompts.js";
import { createFlightSearchTool, createBookFlightTool, createGetBookingsTool } from "./tools.js";

export class FlightyAgent {
    static getTools() {
        return [
            createFlightSearchTool(),
            createBookFlightTool(),
            createGetBookingsTool()
        ];
    }

    static get systemPrompt() {
        return FLIGHTY_SYSTEM_PROMPT;
    }

    static async handleMessage(agent, message) {
        try {
            console.log('Flighty Agent handling message:', message);
            
            // Create a simple HumanMessage with just the text content
            const humanMessage = new HumanMessage(message);

            const stream = await agent.stream(
                { messages: [humanMessage] },
                {
                    configurable: {
                        thread_id: "Flighty_Agent",
                        metadata: {
                            agent_type: "flight-booking",
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
}