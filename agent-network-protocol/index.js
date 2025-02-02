import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@libp2p/noise";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { kadDHT } from "@libp2p/kad-dht";
import { identify } from "@libp2p/identify";
import { ethers } from "ethers";
import PeerId from "peer-id";

import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const AGENT_REGISTRY_ADDRESS = "YOUR_SMART_CONTRACT_ADDRESS";
const TOPIC_PREFIX = "agent-communication";

class AgentProtocol {
  #node;
  #config;
  #messageHandlers;
  #registryContract;
  #agentType;
  #cdpAgent;

  constructor(agentType = "system") {
    this.messageHandlers = new Map();
    this.#agentType = agentType;
  }

  async #createCDPAgent(cdpConfig, tools = [], systemPrompt = "") {
    const llm = new ChatOpenAI({
      model: cdpConfig.model || "gpt-4-turbo-preview",
    });

    const agentkit = await CdpAgentkit.configureWithWallet({
      cdpWalletData: cdpConfig.walletData,
      networkId: cdpConfig.networkId || "base-sepolia",
    });

    const cdpToolkit = new CdpToolkit(agentkit);
    const cdpTools = cdpToolkit.getTools();
    const allTools = [...cdpTools, ...tools];

    const memory = new MemorySaver();

    this.#cdpAgent = createReactAgent({
      llm,
      tools: allTools,
      checkpointSaver: memory,
      messageModifier: systemPrompt,
    });

    return this.#cdpAgent;
  }

  async initialize(config) {
    this.config = config;

    if (config.cdp) {
      await this.#createCDPAgent(
        config.cdp.config,
        config.cdp.tools,
        config.cdp.systemPrompt
      );
    }

    const peerId = await PeerId.create({ keyType: "Ed25519" });

    this.node = await createLibp2p({
      peerId,
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/0"],
      },
      transports: [tcp()],
      streamMuxers: [yamux()],
      connectionEncryption: [noise()],
      services: {
        pubsub: gossipsub({
          enabled: true,
          emitSelf: false,
        }),
        dht: kadDHT({
          protocol: "/agent-dht/1.0.0",
          clientMode: false,
        }),
        identify: identify(),
      },
    });

    const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
    this.registryContract = new ethers.Contract(
      AGENT_REGISTRY_ADDRESS,
      [
        "function registerAgent(string name, address evmAddress, address walletAddress, string[] capabilities, string description)",
      ],
      provider
    );

    await this.#setupMessageHandling();
    await this.#registerOnChain();
    await this.node.start();
  }

  async #setupMessageHandling() {
    const topic = `${TOPIC_PREFIX}/${this.config.name}`;
    await this.node.services.pubsub.subscribe(topic);

    this.node.services.pubsub.addEventListener("message", async (evt) => {
      try {
        const message = JSON.parse(evt.detail.data.toString());

        if (
          this.config.allowedSenders.length &&
          !this.config.allowedSenders.includes(message.sender)
        ) {
          return;
        }

        if (message.messageType === "REQUEST") {
          const handler = this.messageHandlers.get(message.payload.type);
          if (handler) {
            const response = await handler(message.payload);
            await this.sendResponse(
              message.sender,
              response,
              message.conversationId
            );
          }
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });
  }

  async #registerOnChain() {
    const signer = new ethers.Wallet("YOUR_PRIVATE_KEY");
    const tx = await this.registryContract
      .connect(signer)
      .registerAgent(
        this.config.name,
        this.config.evmAddress,
        this.config.walletAddress,
        this.config.capabilities,
        this.config.description || ""
      );
    await tx.wait();
  }

  async sendRequest(recipients, payload, type) {
    const message = {
      sender: this.config.name,
      recipient: recipients,
      payload: { ...payload, type },
      signature: "", // Add signature logic
      timestamp: Date.now(),
      messageType: "REQUEST",
      conversationId: `${Date.now()}-${Math.random()}`,
    };

    for (const recipient of recipients) {
      const topic = `${TOPIC_PREFIX}/${recipient}`;
      await this.node.services.pubsub.publish(
        topic,
        Buffer.from(JSON.stringify(message))
      );
    }
    return message.conversationId;
  }

  async #sendResponse(recipient, payload, ...rest) {
    const message = {
      sender: this.config.name,
      recipient: [recipient],
      payload,
      signature: "",
      timestamp: Date.now(),
      messageType: "RESPONSE",
      conversationId,
    };

    const topic = `${TOPIC_PREFIX}/${recipient}`;
    await this.node.services.pubsub.publish(
      topic,
      Buffer.from(JSON.stringify(message))
    );
  }

  onRequest(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  async findAgentsByCapability(capability) {
    // Query the registry contract for agents with matching capability
    // Implementation depends on your smart contract design
    return [];
  }

  async stop() {
    await this.node.stop();
  }

  async handleUserMessage(message) {
    if (this.#agentType !== "user") {
      throw new Error(
        "Direct user messages are only supported for user agents"
      );
    }

    const stream = await this.#cdpAgent.stream(
      {
        messages: [
          new HumanMessage(
            message +
              "\nFor context, today's date is: " +
              new Date().toISOString().split("T")[0]
          ),
        ],
      },
      { configurable: { thread_id: this.config.name } }
    );

    return stream;
  }
}

export const AgentTypes = {
  SYSTEM: "system",
  USER: "user",
};

export { AgentProtocol };
