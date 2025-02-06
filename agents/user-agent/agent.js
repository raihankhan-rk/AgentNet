import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_SYSTEM_PROMPT } from "./prompts.js";
import {
  createAgentCommunicationTool,
  createAgentDiscoveryTool,
  createAgentWalletTool,
  createMultiAgentCommunicationTool
} from "./tools.js";

export class UserAgent {
  constructor(agentConfig, protocol) {
    this.agentConfig = agentConfig;
    this.protocol = protocol;
    this.agent = null;
    this.userId = `user_${uuidv4()}`;
    this.runnableConfig = {
      configurable: {
        thread_id: "User_Agent",
        metadata: {
          agent_type: "user",
        },
      },
    };
    this.walletAddress = agentConfig.walletAddress || null;
    this.llm = null;
  }

  async initialize() {
    this.llm = new ChatOpenAI({
      model: this.agentConfig.model || "gpt-4o-mini",
      temperature: 0.7,
    });

    const agentkit = await CdpAgentkit.configureWithWallet({
      cdpWalletData: this.agentConfig.cdpWalletData || "",
      networkId: this.agentConfig.networkId || "base-sepolia",
    });

    const cdpToolkit = new CdpToolkit(agentkit);
    const cdpTools = cdpToolkit.getTools();
    const customTools = [
      createAgentCommunicationTool(this.protocol),
      createMultiAgentCommunicationTool(this.protocol),
      createAgentDiscoveryTool(this.protocol),
      createAgentWalletTool(this.protocol)
    ];

    this.agent = createReactAgent({
      llm: this.llm,
      tools: [...cdpTools, ...customTools],
      checkpointSaver: new MemorySaver(),
      messageModifier: this.agentConfig.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    });
  }

  async handleMessage(input) {
    try {
      if (!this.walletAddress) {
        throw new Error('No wallet address provided. Please connect wallet first.');
      }

      let userContext = await this.protocol.getUserContext(this.walletAddress);
      console.log('Nillion Debug: Current user context:', JSON.stringify(userContext, null, 2));
      
      const currentName = userContext?.userProfile?.name?.$share?.$allot || 'Anonymous';
      const isNewUser = !userContext || currentName === 'Anonymous';

      if (isNewUser) {
        console.log('Nillion Debug: New user detected');
        const nameExtraction = await this.protocol.extractNameFromMessage(this.llm, input);
        if (nameExtraction.name) {
          userContext = await this.protocol.createOrUpdateUserContext(
            this.walletAddress,
            {
              name: nameExtraction.name,
              preferences: {}
            }
          );
          await this.protocol.addChatMessage(this.walletAddress, {
            message: input,
            type: 'human',
            timestamp: new Date().toISOString()
          });
          await this.protocol.addChatMessage(this.walletAddress, {
            message: nameExtraction.response,
            type: 'ai',
            timestamp: new Date().toISOString()
          });
          return {
            type: "response",
            content: nameExtraction.response
          };
        } else {
          // If no name found, ask for it naturally.
          await this.protocol.addChatMessage(this.walletAddress, {
            message: input,
            type: 'human',
            timestamp: new Date().toISOString()
          });
          const response = "Hi there! What's your name?";
          await this.protocol.addChatMessage(this.walletAddress, {
            message: response,
            type: 'ai',
            timestamp: new Date().toISOString()
          });
          return {
            type: "response",
            content: response
          };
        }
      } else {
        console.log('Nillion Debug: Existing user detected');
        const nameExtraction = await this.protocol.extractNameFromMessage(this.llm, input);
        const newName = nameExtraction.name;
        const nameUpdated = newName && newName !== currentName;
        if (nameUpdated) {
          const preferences = Array.isArray(userContext.userProfile.preferences)
            ? {}
            : JSON.parse(userContext.userProfile.preferences.$share.$allot || '{}');
          userContext = await this.protocol.createOrUpdateUserContext(
            this.walletAddress,
            {
              name: newName,
              preferences: preferences
            }
          );
          console.log('Nillion Debug: Updated user context:', JSON.stringify(userContext, null, 2));
        }

        await this.protocol.addChatMessage(this.walletAddress, {
          message: input,
          type: 'human',
          timestamp: new Date().toISOString()
        });

        const contextualizedInput = {
          messages: [new HumanMessage(input)],
          context: {
            userProfile: {
              name: Array.isArray(userContext.userProfile.name)
                ? 'Anonymous'
                : userContext.userProfile.name.$share.$allot,
              preferences: Array.isArray(userContext.userProfile.preferences)
                ? {}
                : JSON.parse(userContext.userProfile.preferences.$share.$allot || '{}')
            },
            nameJustUpdated: nameUpdated
          }
        };

        console.log('Nillion Debug: Contextualized Input:', JSON.stringify(contextualizedInput, null, 2));

        const stream = await this.agent.stream(contextualizedInput, this.runnableConfig);
        let response = "";
        for await (const chunk of stream) {
          if ("agent" in chunk) {
            response += chunk.agent.messages[0].content + "\n";
          }
        }
        const trimmedResponse = response.trim();

        await this.protocol.addChatMessage(this.walletAddress, {
          message: trimmedResponse,
          type: 'ai',
          timestamp: new Date().toISOString()
        });

        return {
          type: "response",
          content: trimmedResponse
        };
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
      return {
        type: "error",
        content: String(error.message)
      };
    }
  }

  async cleanup() {
    // Any cleanup needed
  }
}
