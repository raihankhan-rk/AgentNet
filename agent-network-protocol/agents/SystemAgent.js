import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

export class SystemAgent {
    constructor(agentConfig) {
        this.agentConfig = agentConfig;
        this.agent = null;
        this.config = null;
    }

    async initialize() {
        const llm = new ChatOpenAI({
            model: this.agentConfig.model || "gpt-4o-mini",
            temperature: 0.7,
            maxRetries: 3,
            streaming: true
        });

        const agentkit = await CdpAgentkit.configureWithWallet({
            cdpWalletData: this.agentConfig.cdpWalletData || "",
            networkId: this.agentConfig.networkId || "base-sepolia",
            cdpApiKeyName: this.agentConfig.cdpApiKeyName || "",
            cdpApiKeyPrivateKey: this.agentConfig.cdpApiKeyPrivateKey || "",
        });

        this.agentConfig = {
            ...this.agentConfig,
            walletAddress: this.agentConfig.cdpWalletData ? 
                JSON.parse(this.agentConfig.cdpWalletData).defaultAddressId :
                undefined
        }

        // Setup tools
        const cdpToolkit = new CdpToolkit(agentkit);
        const cdpTools = cdpToolkit.getTools();
        const customTools = this.agentConfig.getCustomTools?.() || [];
        const tools = [...cdpTools, ...customTools];

        // Create agent with increased recursion limit and tool handling
        const memory = new MemorySaver();
        this.config = {
            configurable: {
                thread_id: this.agentConfig.threadId || "System_Agent",
                metadata: {
                    agent_type: this.agentConfig.type || "system",
                },
            },
            recursionLimit: 50, // Increased from default 25
            maxConcurrency: 1,
            toolConcurrency: 1
        };

        this.agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: this.agentConfig.systemPrompt,
            handleToolError: async (error, runId) => {
                console.error(`Tool execution error in ${this.agentConfig.name}:`, error);
                return {
                    type: "error",
                    content: `Tool execution failed: ${error.message}`
                };
            },
            handleLLMError: async (error, runId) => {
                console.error(`LLM error in ${this.agentConfig.name}:`, error);
                return {
                    type: "error",
                    content: `Language model error: ${error.message}`
                };
            }
        });
    }

    async handleMessage(message) {
        try {
            console.log(`${this.agentConfig.name} handling message:`, message);
            
            // Ensure message is properly formatted for tool execution
            const formattedMessage = typeof message === 'string' ? 
                message : 
                message.content || JSON.stringify(message);

            const stream = await this.agent.stream(
                { 
                    messages: [new HumanMessage(formattedMessage)],
                    tools: this.agentConfig.getCustomTools?.() || [],
                },
                this.config
            );

            let response = "";
            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    response += chunk.agent.messages[0].content + "\n";
                } else if ("tools" in chunk) {
                    // Handle tool responses
                    const toolResponses = chunk.tools.messages
                        .map(msg => msg.content)
                        .filter(Boolean);
                    response += toolResponses.join("\n");
                }
            }

            return {
                type: "response",
                content: response.trim(),
            };
        } catch (error) {
            console.error(`${this.agentConfig.name} error:`, error);
            
            // Handle specific error types
            if (error.lc_error_code === "GRAPH_RECURSION_LIMIT") {
                return {
                    type: "error",
                    content: "The request was too complex. Please try breaking it down into smaller steps."
                };
            }
            
            if (error.lc_error_code === "INVALID_TOOL_RESULTS") {
                return {
                    type: "error",
                    content: "There was an issue processing the tools. Please try your request again."
                };
            }

            return {
                type: "error",
                content: `Error processing request: ${error.message}`
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