import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../../agent-network-protocol/index.js";
import { UserAgent } from "./agent.js";

dotenv.config();

async function main() {
    try {
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        // Mock wallet connection for testing
        const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
        
        const userAgent = new UserAgent({
            model: "gpt-4o-mini",
            walletAddress: mockWalletAddress
        }, protocol);
        
        await userAgent.initialize();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log('\n=== User Agent Started ===');
        console.log('Connected wallet:', mockWalletAddress);
        console.log('Type your messages below.');
        console.log('Use /setup <name> if this is your first time.');
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