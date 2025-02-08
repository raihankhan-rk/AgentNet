import dotenv from "dotenv";
import path from "path";
import AgentNetworkProtocol from "../../../agent-network-protocol/index.js";
import { AirbnbAgent } from "../agents/airbnb/agent.js";
import { FlightyAgent } from "../agents/flighty/agent.js";
import { UserAgent } from "../agents/user-agent/agent.js";
import { loadEnvFromFolder } from "../agents/utils/loadEnv.js";

dotenv.config();

class AgentManager {
    constructor() {
        this.protocol = null;
        this.userAgent = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            
            const flightyEnv = loadEnvFromFolder(path.join(process.cwd(), 'agents/flighty'));
            const airbnbEnv = loadEnvFromFolder(path.join(process.cwd(), 'agents/airbnb'));
            const userEnv = loadEnvFromFolder(path.join(process.cwd(), 'agents/user-agent'));

            this.protocol = new AgentNetworkProtocol();
            await this.protocol.initialize();

            console.log('Initializing Flighty Agent...');
            const flightyAgent = new FlightyAgent({
                networkId: flightyEnv.NETWORK_ID || "base-sepolia",
                model: "gpt-4o-mini",
                cdpWalletData: flightyEnv.CDP_WALLET_DATA,
                cdpApiKeyName: flightyEnv.CDP_API_KEY_NAME || "",
                cdpApiKeyPrivateKey: flightyEnv.CDP_API_KEY_PRIVATE_KEY || "",
            });
            await flightyAgent.initialize();

            console.log('Deploying Flighty Agent...');
            const flightyDeployment = await this.protocol.deployAgent(flightyAgent, {
                name: "Flighty Travel Assistant",
                description: "An AI agent that helps users search and book flights",
                capabilities: ["flight-booking"],
                walletAddress: flightyAgent.agentConfig.walletAddress
            });

            console.log('Initializing Airbnb Agent...');
            const airbnbAgent = new AirbnbAgent({
                model: "gpt-4o-mini",
                cdpWalletData: airbnbEnv.CDP_WALLET_DATA,
                networkId: airbnbEnv.NETWORK_ID || "base-sepolia",
                cdpApiKeyName: airbnbEnv.CDP_API_KEY_NAME || "",
                cdpApiKeyPrivateKey: airbnbEnv.CDP_API_KEY_PRIVATE_KEY || "",
            });
            await airbnbAgent.initialize();

            console.log('Deploying Airbnb Agent...');
            const airbnbDeployment = await this.protocol.deployAgent(airbnbAgent, {
                name: "Airbnb Accommodation Assistant",
                description: "An AI agent that helps users search and book accommodations",
                capabilities: ["accommodation-booking"],
                walletAddress: airbnbAgent.agentConfig.walletAddress
            });

            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Initializing User Agent...');
            this.userAgent = new UserAgent({
                model: "gpt-4o-mini",
                cdpWalletData: userEnv.CDP_WALLET_DATA,
                networkId: userEnv.NETWORK_ID || "base-sepolia",
            }, this.protocol);
            await this.userAgent.initialize();

            this.initialized = true;
        } catch (error) {
            console.error("Failed to start agents:", error);
            throw error;
        }
    }

    async handleMessage(message) {
        if (!this.initialized) {
            throw new Error("AgentManager not initialized");
        }
        const response = await this.userAgent.handleMessage(message);
        console.log('Response:', response);
        return response;
    }

    async cleanup() {
        if (this.userAgent) {
            await this.userAgent.cleanup();
        }
        if (this.protocol) {
            await this.protocol.stop();
        }
    }
}

export const agentManager = new AgentManager();