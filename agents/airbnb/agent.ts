import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import * as fs from "fs";
import {
  createSearchHotelsTool,
  createGetHotelDetailsTool,
  createBookHotelTool,
  createGetBookingsTool
} from "./tools";
import * as readline from "readline";
import { AIRBNB_SYSTEM_PROMPT } from "./prompts";

dotenv.config();

/**
 * Initialize the agent with CDP AgentKit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  // Initialize LLM
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  // Get wallet data from environment variable
  const walletDataStr = process.env.CDP_WALLET_DATA;
  if (!walletDataStr) {
    throw new Error("CDP_WALLET_DATA environment variable is not set");
  }

  // Configure CDP AgentKit
  const config = {
    cdpWalletData: walletDataStr,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  // Initialize CDP AgentKit
  const agentkit = await CdpAgentkit.configureWithWallet(config);

  // Initialize CDP AgentKit Toolkit and get tools
  const cdpToolkit = new CdpToolkit(agentkit);
  const cdpTools = cdpToolkit.getTools();

  // Add our custom hotel tools
  const searchHotelsTool = createSearchHotelsTool();
  const getHotelDetailsTool = createGetHotelDetailsTool();
  const bookHotelTool = createBookHotelTool();
  const getBookingsTool = createGetBookingsTool();
  
  const tools = [
    ...cdpTools,
    searchHotelsTool,
    getHotelDetailsTool,
    bookHotelTool,
    getBookingsTool
  ];

  // Store buffered conversation history in memory
  const memory = new MemorySaver();

  // Create React Agent using the LLM and tools
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: AIRBNB_SYSTEM_PROMPT,
  });

  // Change thread ID to match the agent
  const agentConfig = { configurable: { thread_id: "Airbnb Agent" } };

  return { agent, config: agentConfig };
}

// Add the chat mode function you found
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  try {
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput + "\nFor context, today's date is: " + new Date().toISOString().split('T')[0])] },
        config
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Start the agent
if (require.main === module) {
  console.log("Starting Agent...");
  initializeAgent()
    .then(({ agent, config }) => runChatMode(agent, config))
    .catch(error => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}