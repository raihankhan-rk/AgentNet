import dotenv from "dotenv";
import AgentNetworkProtocol from "../../agent-network-protocol/index.js";
import { createAgent } from "../../agent-network-protocol/agent-factory.js";
import { AirbnbAgent } from "./agent.js";
import { createSearchHotelsTool, createGetHotelDetailsTool, createBookHotelTool, createGetBookingsTool } from "./tools.js";
import { AIRBNB_SYSTEM_PROMPT } from "./prompts.js";
import * as readline from "readline";

dotenv.config();

export async function deployAirbnbNode() {
    try {
        console.log('Initializing Airbnb node deployment...');
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        const agent = await createAgent({
            cdpConfig: {
                cdpWalletData: process.env.AIRBNB_CDP_WALLET_DATA,
                networkId: process.env.AIRBNB_NETWORK_ID,
                model: "gpt-4o-mini"
            },
            tools: [
                createSearchHotelsTool(),
                createGetHotelDetailsTool(),
                createBookHotelTool(),
                createGetBookingsTool()
            ],
            systemPrompt: AIRBNB_SYSTEM_PROMPT,
            handleMessage: AirbnbAgent.handleMessage,
            metadata: {
                name: "Airbnb Accommodation Assistant",
                description: "An AI agent that helps users search and book accommodations",
                capabilities: ["accommodation-booking"]
            }
        });

        const deployment = await protocol.deployAgent(agent, agent.metadata);
        console.log('Airbnb Agent deployed successfully with peerId:', deployment.peerId);
        
        // Keep the process running
        console.log('\nNode is running. Press Ctrl+C to stop.');
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\nShutting down Airbnb node...');
            await protocol.stop();
            process.exit(0);
        });
        
        return { protocol, deployment };
    } catch (error) {
        console.error('Error deploying Airbnb node:', error);
        throw error;
    }
}

export async function runLocalTest() {
    try {
        console.log('Initializing Airbnb local test mode...');
        const agentWrapper = await createAgent({
            cdpConfig: {
                cdpWalletData: process.env.AIRBNB_CDP_WALLET_DATA,
                networkId: process.env.AIRBNB_NETWORK_ID,
                model: "gpt-4o-mini"
            },
            tools: [
                createSearchHotelsTool(),
                createGetHotelDetailsTool(),
                createBookHotelTool(),
                createGetBookingsTool()
            ],
            systemPrompt: AIRBNB_SYSTEM_PROMPT,
            handleMessage: AirbnbAgent.handleMessage
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log('\n=== Airbnb Local Test Mode ===');
        console.log('Type your accommodation-related questions below.');
        console.log('Type "exit" to end the session.\n');

        const askQuestion = () => {
            rl.question("\nYou: ", async (input) => {
                if (input.toLowerCase() === "exit") {
                    console.log('\nEnding test session...');
                    rl.close();
                    return;
                }

                try {
                    const response = await AirbnbAgent.handleMessage(agentWrapper.agent, input);
                    console.log('\nAirbnb:', response.content);
                } catch (error) {
                    console.error('\nError:', error.message);
                }

                askQuestion();
            });
        };

        askQuestion();
    } catch (error) {
        console.error('Error running local test:', error);
        process.exit(1);
    }
}

// Run the appropriate mode based on command line arguments
const args = process.argv.slice(2);

if (args.includes('--run-locally')) {
    console.log('Starting Airbnb in local test mode...');
    runLocalTest().catch(error => {
        console.error('Failed to run local test:', error);
        process.exit(1);
    });
} else if (args.includes('--run-node')) {
    console.log('Starting Airbnb in network node mode...');
    deployAirbnbNode().catch(error => {
        console.error('Failed to deploy node:', error);
        process.exit(1);
    });
} else {
    console.log('Please specify either --run-locally or --run-node');
    process.exit(1);
} 