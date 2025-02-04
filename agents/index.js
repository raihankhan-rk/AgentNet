import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../agent-network-protocol/index.js";
import { AirbnbAgent } from "./airbnb/agent.js";
import { FlightyAgent } from "./flighty/agent.js";
import { UserAgent } from "./user-agent/agent.js";
import { loadEnvFromFolder } from "./utils/loadEnv.js";
import path from "path";

dotenv.config();

async function main() {
    try {
        // Load root .env first (for shared variables)
        loadEnvFromFolder(process.cwd());
        
        // Load agent-specific .env files
        const flightyEnv = loadEnvFromFolder(path.join(process.cwd(), 'flighty'));
        const airbnbEnv = loadEnvFromFolder(path.join(process.cwd(), 'airbnb'));
        const userEnv = loadEnvFromFolder(path.join(process.cwd(), 'user-agent'));

        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        console.log('Initializing Flighty Agent...');
        const flightyAgent = new FlightyAgent({
            networkId: flightyEnv.NETWORK_ID || process.env.NETWORK_ID || "base-sepolia",
            model: "gpt-4o-mini",
            cdpWalletData: flightyEnv.CDP_WALLET_DATA,
        });
        await flightyAgent.initialize();

        console.log('Deploying Flighty Agent...');
        const flightyDeployment = await protocol.deployAgent(flightyAgent, {
            name: "Flighty Travel Assistant",
            description: "An AI agent that helps users search and book flights",
            capabilities: ["flight-booking"],
            walletAddress: flightyAgent.agentConfig.walletAddress
        });
        console.log('Flighty Agent deployed with peerId:', flightyDeployment.peerId);

        console.log('Initializing Airbnb Agent...');
        const airbnbAgent = new AirbnbAgent({
            model: "gpt-4o-mini",
            cdpWalletData: airbnbEnv.CDP_WALLET_DATA,
            networkId: airbnbEnv.NETWORK_ID || process.env.NETWORK_ID || "base-sepolia",
        });
        await airbnbAgent.initialize();

        console.log('Deploying Airbnb Agent...');
        const airbnbDeployment = await protocol.deployAgent(airbnbAgent, {
            name: "Airbnb Accommodation Assistant",
            description: "An AI agent that helps users search and book accommodations",
            capabilities: ["accommodation-booking"],
            walletAddress: airbnbAgent.agentConfig.walletAddress
        });
        console.log('Airbnb Agent deployed with peerId:', airbnbDeployment.peerId);

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Initializing User Agent...');
        const userAgent = new UserAgent({
            model: "gpt-4o-mini",
            cdpWalletData: userEnv.CDP_WALLET_DATA,
            networkId: userEnv.NETWORK_ID || process.env.NETWORK_ID || "base-sepolia",
        }, protocol);
        await userAgent.initialize();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log('\n=== User Agent Started ===');
        console.log('Type your questions below.');
        console.log('Type "exit" to end the conversation.\n');

        const askQuestion = () => {
            rl.question("\nYou: ", async (input) => {
                if (input.toLowerCase() === "exit") {
                    console.log('\n[DEBUG] Shutting down chat session...');
                    await userAgent.cleanup();
                    await protocol.stop();
                    console.log('[DEBUG] Chat session ended, all resources cleaned up');
                    console.log('\n=== User Agent Stopped ===\n');
                    rl.close();
                    return;
                }

                try {
                    const response = await userAgent.handleMessage(input);
                    // Add a newline before response for cleaner separation
                    console.log('\nAssistant:', response.content);
                } catch (error) {
                    console.error('\n[ERROR]:', error.message);
                }

                askQuestion();
            });
        };

        askQuestion();
    } catch (error) {
        console.error("Failed to start agents:", error);
        process.exit(1);
    }
}

main();