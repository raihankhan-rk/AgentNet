import dotenv from "dotenv";
import * as readline from "readline";
import AgentNetworkProtocol from "../../agent-network-protocol/index.js";
import { UserAgent } from "./agent.js";

dotenv.config();

async function main() {
    try {
        const protocol = new AgentNetworkProtocol();
        await protocol.initialize();

        const userAgent = new UserAgent({
            model: "gpt-4o-mini",
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

main()