import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { createAgentCommunicationTool, createAgentDiscoveryTool } from "./tools.js";

const DEFAULT_SYSTEM_PROMPT =
    `You are an orchestrator agent that helps users with various tasks. 
When a user mentions anything related to flights or travel, you should:
1. First use the discover_agents tool to find available agents with the capability "flight-booking" (use exactly this string)
2. Use the communicate_with_agent tool to send specific requests to the flight booking agent, always using "flight-booking" as the capability
3. Process their responses and either:
   - Return results to the user
   - Ask for more information if needed
   - Handle any errors appropriately

For flight-related tasks:
- Search flights using natural language understanding to extract locations and dates
- Help with booking flights by gathering necessary information
- Check existing bookings when requested

For all other queries, handle them directly. Always maintain a helpful and professional tone.
When receiving responses from other agents, interpret JSON responses and present them in a user-friendly format.`;

export class OrchestratorAgent {
    constructor(orchestratorConfig, protocol) {
        this.orchestratorConfig = orchestratorConfig;
        this.protocol = protocol;
        this.memory = new MemorySaver();
        this.agent = null;
        this.config = null;
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.orchestratorConfig.model || "gpt-4o-mini",
            temperature: 0.7,
        });

        this.config = {
            configurable: {
                thread_id: "Orchestrator Agent",
                metadata: {
                    agent_type: "orchestrator",
                },
            },
        };

        const tools = [
            createAgentCommunicationTool(this.protocol),
            createAgentDiscoveryTool(this.protocol),
        ];

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: this.memory,
            messageModifier: this.orchestratorConfig.systemPrompt ||
                DEFAULT_SYSTEM_PROMPT,
        });
    }

    async handleMessage(message) {
        try {
            const stream = await this.agent.stream(
                { messages: [new HumanMessage(message)] },
                this.config,
            );

            let response = "";
            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    response += chunk.agent.messages[0].content + "\n";
                } else if ("tools" in chunk) {
                    response += chunk.tools.messages[0].content + "\n";
                }
            }

            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            return {
                type: "error",
                content: `Error processing request: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            };
        }
    }

    getPendingResponses() {
        return this.protocol.pendingResponses;
    }
}