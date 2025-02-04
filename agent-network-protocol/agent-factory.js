import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";

export async function createAgent({ 
    cdpConfig,
    tools,
    systemPrompt,
    handleMessage,
    metadata
}) {
    const cdpAgentkit = await CdpAgentkit.configureWithWallet({
        cdpWalletData: cdpConfig.cdpWalletData || "",
        networkId: cdpConfig.networkId || "base-sepolia",
    });

    const llm = new ChatOpenAI({
        model: cdpConfig.model || "gpt-4o-mini",
    });

    const cdpToolkit = new CdpToolkit(cdpAgentkit);
    const cdpTools = cdpToolkit.getTools();
    const allTools = [...cdpTools, ...tools];

    const memory = new MemorySaver();
    const agent = createReactAgent({
        llm,
        tools: allTools,
        checkpointSaver: memory,
        messageModifier: systemPrompt,
    });

    return {
        agent,
        handleMessage,
        metadata
    };
} 