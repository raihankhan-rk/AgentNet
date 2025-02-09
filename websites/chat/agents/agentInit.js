import dotenv from "dotenv";
import path from "path";
import AgentNetworkProtocol from "../../../agent-network-protocol/index.js";
import { AIRBNB_SYSTEM_PROMPT } from "./airbnb/prompts.js";
import { createTransactionVerificationTool as createAirbnbTransactionTool, createBookHotelTool, createGetBookingsTool, createGetHotelDetailsTool, createSearchHotelsTool } from "./airbnb/tools.js";
import { FLIGHTY_SYSTEM_PROMPT } from "./flighty/prompts.js";
import { createBookFlightTool, createGetBookingsTool as createFlightBookingsTool, createFlightSearchTool, createTransactionVerificationTool as createFlightyTransactionTool } from "./flighty/tools.js";
import { DEFAULT_SYSTEM_PROMPT } from "./user-agent/prompts.js";
import { loadEnvFromFolder } from "./utils/loadEnv.js";

dotenv.config();

async function initializeAgents() {
    const protocol = new AgentNetworkProtocol();
    await protocol.initialize();

    const flightyEnv = loadEnvFromFolder(path.join(process.cwd(), 'agents/flighty'));
    const airbnbEnv = loadEnvFromFolder(path.join(process.cwd(), 'agents/airbnb'));
    const userEnv = loadEnvFromFolder(path.join(process.cwd(), 'agents/user-agent'));

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
        cdpWalletData: flightyEnv.CDP_WALLET_DATA,
        networkId: flightyEnv.NETWORK_ID || "base-sepolia",
        systemPrompt: FLIGHTY_SYSTEM_PROMPT,
        threadId: "Flighty_Agent",
        type: "flight-booking",
        name: "Flighty Travel Assistant",
        getCustomTools: () => flightyTools
    }, {
        name: "Flighty Travel Assistant",
        description: "An AI agent that helps users search and book flights",
        capabilities: ["flight-booking"],
        walletAddress: JSON.parse(flightyEnv.CDP_WALLET_DATA).defaultAddressId
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
        cdpWalletData: airbnbEnv.CDP_WALLET_DATA,
        networkId: airbnbEnv.NETWORK_ID || "base-sepolia",
        systemPrompt: AIRBNB_SYSTEM_PROMPT,
        threadId: "Airbnb_Agent",
        type: "accommodation-booking",
        name: "Airbnb Accommodation Assistant",
        getCustomTools: () => airbnbTools
    }, {
        name: "Airbnb Accommodation Assistant",
        description: "An AI agent that helps users search and book accommodations",
        capabilities: ["accommodation-booking"],
        walletAddress: JSON.parse(airbnbEnv.CDP_WALLET_DATA).defaultAddressId
    });

    // Initialize user agent
    console.log('Initializing User Agent...');
    const userAgent = await protocol.createUserAgent({
        model: "gpt-4o-mini",
        cdpWalletData: userEnv.CDP_WALLET_DATA,
        networkId: userEnv.NETWORK_ID || "base-sepolia",
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