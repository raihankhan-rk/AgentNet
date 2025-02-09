import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../../agent-network-protocol/index.js";
import { getAgentEnv } from "../utils/loadEnv.js";
import { FlightyAgent } from "./agent.js";

dotenv.config();

async function main() {
    const localMode = process.argv.includes("--local");
    const agentEnv = getAgentEnv();
    
    try {
        // Create and initialize the protocol
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        // Initialize Flighty Agent
        console.log('Initializing Flighty Agent...');
        const flightyAgent = new FlightyAgent({
            cdpWalletData: agentEnv.CDP_WALLET_DATA,
            networkId: agentEnv.NETWORK_ID || "base-sepolia",
            model: "gpt-4o-mini",
        });
        await flightyAgent.initialize();

        if (localMode) {
            // Local testing mode
            console.log('\n=== Flighty Assistant Local Testing Mode ===');
            console.log('Type your flight-related questions below.');
            console.log('Type "exit" to end the conversation.\n');

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            const askQuestion = () => {
                rl.question("\nYou: ", async (input) => {
                    if (input.toLowerCase() === "exit") {
                        console.log('\nEnding local test session...');
                        rl.close();
                        process.exit(0);
                    }

                    try {
                        const response = await flightyAgent.handleMessage(input);
                        console.log('\nAssistant:', response.content);
                    } catch (error) {
                        console.error('\nError:', error.message);
                    }

                    askQuestion();
                });
            };

            askQuestion();
        } else {
            // Deployment mode
            console.log('Deploying Flighty Agent...');
            const deployment = await protocol.deployAgent(flightyAgent, {
                name: "Flighty Travel Assistant",
                description: "An AI agent that helps users search and book flights",
                capabilities: ["flight-booking"],
            });
            console.log('Flighty Agent deployed with peerId:', deployment.peerId);
        }
    } catch (error) {
        console.error("Failed to start Flighty agent:", error);
        process.exit(1);
    }
}

main(); 