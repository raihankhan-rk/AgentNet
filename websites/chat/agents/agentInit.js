import dotenv from "dotenv";
import AgentNetworkProtocol from "../../../agent-network-protocol/index.js";
import { AIRBNB_SYSTEM_PROMPT } from "./airbnb/prompts.js";
import { createTransactionVerificationTool as createAirbnbTransactionTool, createBookHotelTool, createGetBookingsTool, createGetHotelDetailsTool, createSearchHotelsTool } from "./airbnb/tools.js";
import { FLIGHTY_SYSTEM_PROMPT } from "./flighty/prompts.js";
import { createBookFlightTool, createGetBookingsTool as createFlightBookingsTool, createFlightSearchTool, createTransactionVerificationTool as createFlightyTransactionTool } from "./flighty/tools.js";
import { DEFAULT_SYSTEM_PROMPT } from "./user-agent/prompts.js";
import { loadEnvFromFolder } from "./utils/loadEnv.js";

dotenv.config();

// Add this ASCII art banner
const BANNER = `
                                                                        
 _____             _   _____     _      _____         _               _ 
|  _  |___ ___ ___| |_|   | |___| |_   |  _  |___ ___| |_ ___ ___ ___| |
|     | . | -_|   |  _| | | | -_|  _|  |   __|  _| . |  _| . |  _| . | |
|__|__|_  |___|_|_|_| |_|___|___|_|    |__|  |_| |___|_| |___|___|___|_|
      |___|                                                                                                                                                            
`;

// Add this before your server starts
console.log('\x1b[36m%s\x1b[0m', BANNER); // Print in cyan color

async function initializeAgents() {
    const protocol = new AgentNetworkProtocol();
    await protocol.initialize();

    const env = loadEnvFromFolder();

    // Initialize system agents
    console.log('Initializing Flighty Agent...');
    const flightyTools = [
        createFlightSearchTool(),
        createFlightBookingsTool(),
        createBookFlightTool(),
        createFlightyTransactionTool()
    ];

    console.log('Deploying Flighty Agent...');
    const flightyDeployment = await protocol.deploySystemAgent({
        model: "gpt-4o-mini",
        cdpWalletData: env.FLIGHTY_CDP_WALLET_DATA,
        networkId: env.NETWORK_ID || "base-sepolia",
        cdpApiKeyName: env.CDP_API_KEY_NAME || "",
        cdpApiKeyPrivateKey: env.CDP_API_KEY_PRIVATE_KEY || "",
        systemPrompt: FLIGHTY_SYSTEM_PROMPT,
        threadId: "Flighty_Agent",
        type: "flight-booking",
        name: "Flighty Travel Assistant",
        getCustomTools: () => flightyTools
    }, {
        name: "Flighty Travel Assistant",
        description: "An AI agent that helps users search and book flights",
        capabilities: ["flight-booking"],
        walletAddress: JSON.parse(env.FLIGHTY_CDP_WALLET_DATA).defaultAddressId
    });

    console.log('Initializing Airbnb Agent...');
    const airbnbTools = [
        createSearchHotelsTool(),
        createGetHotelDetailsTool(),
        createBookHotelTool(),
        createGetBookingsTool(),
        createAirbnbTransactionTool()
    ];

    console.log('Deploying Airbnb Agent...');
    const airbnbDeployment = await protocol.deploySystemAgent({
        model: "gpt-4o-mini",
        cdpWalletData: env.AIRBNB_CDP_WALLET_DATA,
        networkId: env.NETWORK_ID || "base-sepolia",
        cdpApiKeyName: env.CDP_API_KEY_NAME || "",
        cdpApiKeyPrivateKey: env.CDP_API_KEY_PRIVATE_KEY || "",
        systemPrompt: AIRBNB_SYSTEM_PROMPT,
        threadId: "Airbnb_Agent",
        type: "accommodation-booking",
        name: "Airbnb Accommodation Assistant",
        getCustomTools: () => airbnbTools
    }, {
        name: "Airbnb Accommodation Assistant",
        description: "An AI agent that helps users search and book accommodations",
        capabilities: ["accommodation-booking"],
        walletAddress: JSON.parse(env.AIRBNB_CDP_WALLET_DATA).defaultAddressId
    });

    // Initialize user agent
    console.log('Initializing User Agent...');
    const userAgent = await protocol.createUserAgent({
        model: "gpt-4o-mini",
        cdpWalletData: env.USER_CDP_WALLET_DATA,
        networkId: env.NETWORK_ID || "base-sepolia",
        cdpApiKeyName: env.CDP_API_KEY_NAME || "",
        cdpApiKeyPrivateKey: env.CDP_API_KEY_PRIVATE_KEY || "",
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        threadId: "User_Agent"
    });

    return {
        protocol,
        userAgent
    };
}

class AgentManager {
    constructor() {
        this.protocol = null;
        this.userAgent = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            const { protocol, userAgent } = await initializeAgents();
            this.protocol = protocol;
            this.userAgent = userAgent;
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