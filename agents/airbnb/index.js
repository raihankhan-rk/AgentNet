import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../../agent-network-protocol/index.js";
import { AirbnbAgent } from "./agent.js";

dotenv.config();

async function main() {
    const localMode = process.argv.includes("--local");

    try {
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        console.log('Initializing Airbnb Agent...');
        const airbnbAgent = new AirbnbAgent({
            model: "gpt-4o-mini",
        });
        await airbnbAgent.initialize();

        if (localMode) {
            console.log('\n=== Airbnb Assistant Local Testing Mode ===');
            console.log('Type your accommodation-related questions below.');
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
                        const response = await airbnbAgent.handleMessage(input);
                        console.log('\nAssistant:', response.content);
                    } catch (error) {
                        console.error('\nError:', error.message);
                    }

                    askQuestion();
                });
            };

            askQuestion();
        } else {
            console.log('Deploying Airbnb Agent...');
            const deployment = await protocol.deployAgent(airbnbAgent, {
                name: "Airbnb Accommodation Assistant",
                description: "An AI agent that helps users search and book accommodations",
                capabilities: ["accommodation-booking"],
            });
            console.log('Airbnb Agent deployed with peerId:', deployment.peerId);
        }
    } catch (error) {
        console.error("Failed to start Airbnb agent:", error);
        process.exit(1);
    }
}

main(); 