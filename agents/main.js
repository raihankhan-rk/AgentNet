import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../agent-network-protocol/index.js";
import { FlightyAgent } from "./flighty/agent.js";
import { OrchestratorAgent } from "./orchestrator/agent.js";

dotenv.config();

async function main() {
    try {
        // Create and initialize the protocol
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        // Deploy Flighty Agent
        const flightyConfig = {
            cdpWalletData: process.env.CDP_WALLET_DATA || "",
            networkId: process.env.NETWORK_ID || "base-sepolia",
            model: "gpt-4o-mini",
        };

        console.log('Initializing Flighty Agent...');
        const flightyAgent = new FlightyAgent(flightyConfig);
        await flightyAgent.initialize();

        const flightyMetadata = {
            name: "Flighty Travel Assistant",
            description: "An AI agent that helps users search and book flights",
            capabilities: ["flight-booking"],
        };

        console.log('Deploying Flighty Agent...');
        const flightyDeployment = await protocol.deployAgent(flightyAgent, flightyMetadata);
        console.log('Flighty Agent deployed with peerId:', flightyDeployment.peerId);

        // Add delay before deploying Orchestrator
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Deploy Orchestrator Agent
        const orchestratorConfig = {
            model: "gpt-4o-mini",
        };

        const orchestratorAgent = new OrchestratorAgent(
            orchestratorConfig,
            protocol,
        );
        await orchestratorAgent.initialize();

        const orchestratorMetadata = {
            name: "Orchestrator",
            description: "Main orchestrator agent that handles user requests",
            capabilities: ["orchestration"],
        };

        await protocol.deployAgent(orchestratorAgent, orchestratorMetadata);

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