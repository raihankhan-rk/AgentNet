import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

export function createAgentCommunicationTool(protocol) {
    let cachedAgents = {};  // Cache for agents by capability

    return new DynamicStructuredTool({
        name: "communicate_with_agent",
        description: "Communicate with another agent based on capability",
        schema: z.object({
            capability: z.string().describe("The capability to search for"),
            message: z.string().describe("The message to send"),
            requireResponse: z.boolean().optional().describe("Whether to wait for response"),
            metadata: z.record(z.any()).optional().describe("Additional metadata"),
            parallel: z.boolean().optional().describe("Whether to run in parallel with other requests")
        }),
        func: async ({ capability, message, requireResponse = true, metadata = {}, parallel = false }) => {
            // ... existing code ...
        },
    });
}

// Move all other tool creation functions here
export function createMultiAgentCommunicationTool(protocol) {
    // ... existing code ...
}

export function createAgentDiscoveryTool(protocol) {
    // ... existing code ...
}

export function createAgentWalletTool(protocol) {
    // ... existing code ...
}

// New method to get all protocol tools
export function getProtocolTools(protocol) {
    return [
        createAgentCommunicationTool(protocol),
        createMultiAgentCommunicationTool(protocol),
        createAgentDiscoveryTool(protocol),
        createAgentWalletTool(protocol)
    ];
} 