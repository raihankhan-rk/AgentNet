import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../agent-network-protocol/index.js";
import { AirbnbAgent } from "./airbnb/agent.js";
import { FlightyAgent } from "./flighty/agent.js";
import { OrchestratorAgent } from "./orchestrator/agent.js";

dotenv.config();

async function main() {
    try {
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        console.log('Initializing Flighty Agent...');
        const flightyAgent = new FlightyAgent({
            cdpWalletData: process.env.CDP_WALLET_DATA || "",
            networkId: process.env.NETWORK_ID || "base-sepolia",
            model: "gpt-4o-mini",
        });
        await flightyAgent.initialize();

        console.log('Deploying Flighty Agent...');
        const flightyDeployment = await protocol.deployAgent(flightyAgent, {
            name: "Flighty Travel Assistant",
            description: "An AI agent that helps users search and book flights",
            capabilities: ["flight-booking"],
        });
        console.log('Flighty Agent deployed with peerId:', flightyDeployment.peerId);

        console.log('Initializing Airbnb Agent...');
        const airbnbAgent = new AirbnbAgent({
            model: "gpt-4o-mini",
        });
        await airbnbAgent.initialize();

        console.log('Deploying Airbnb Agent...');
        const airbnbDeployment = await protocol.deployAgent(airbnbAgent, {
            name: "Airbnb Accommodation Assistant",
            description: "An AI agent that helps users search and book accommodations",
            capabilities: ["accommodation-booking"],
        });
        console.log('Airbnb Agent deployed with peerId:', airbnbDeployment.peerId);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const orchestratorAgent = new OrchestratorAgent({
            model: "gpt-4o-mini",
        }, protocol);
        await orchestratorAgent.initialize();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log('\n=== Travel Assistant Started ===');
        console.log('Type your travel-related questions below.');
        console.log('Type "exit" to end the conversation.\n');

        const askQuestion = () => {
            rl.question("\nYou: ", async (input) => {
                if (input.toLowerCase() === "exit") {
                    console.log('\n[DEBUG] Shutting down chat session...');
                    await orchestratorAgent.cleanup();
                    await protocol.stop();
                    console.log('[DEBUG] Chat session ended, all resources cleaned up');
                    console.log('\n=== Travel Assistant Stopped ===\n');
                    rl.close();
                    return;
                }

                try {
                    const response = await orchestratorAgent.handleMessage(input);
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