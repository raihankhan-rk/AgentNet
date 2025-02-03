import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../agent-network-protocol/index.js";
import { FlightyAgent } from "./flighty/agent.js";
import { AirbnbAgent } from "./airbnb/agent.js";
import { OrchestratorAgent } from "./orchestrator/agent.js";

dotenv.config();

async function main() {
    try {
        // Create and initialize the protocol
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        // Deploy Flighty Agent
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

        // Deploy Airbnb Agent
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

        // Add delay before deploying Orchestrator
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Deploy Orchestrator Agent
        const orchestratorAgent = new OrchestratorAgent({
            model: "gpt-4o-mini",
        }, protocol);
        await orchestratorAgent.initialize();

        await protocol.deployAgent(orchestratorAgent, {
            name: "Orchestrator",
            description: "Main orchestrator agent that handles user requests",
            capabilities: ["orchestration"],
        });

        // Start chat interface
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log("Chat started. Type 'exit' to end the conversation.");

        const askQuestion = () => {
            rl.question("You: ", async (input) => {
                if (input.toLowerCase() === "exit") {
                    await protocol.stop();
                    rl.close();
                    return;
                }

                try {
                    const response = await orchestratorAgent.handleMessage(input);
                    console.log("Agent:", response.content);
                } catch (error) {
                    console.error("Error:", error.message);
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