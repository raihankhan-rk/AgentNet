import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

export function createAgentCommunicationTool(protocol) {
  return new DynamicStructuredTool({
    name: "communicate_with_agent",
    description: "Find and communicate with agents based on their capabilities",
    schema: z.object({
      capability: z.string().describe("The capability to search for (e.g., 'flight-booking')"),
      message: z.string().describe("The message to send to the agent"),
      requireResponse: z.boolean().optional().describe("Whether to wait for a response"),
      metadata: z.record(z.any()).optional().describe("Additional metadata to send with the message")
    }),
    func: async ({ capability, message, requireResponse = true, metadata = {} }) => {
      try {
        const agents = await protocol.findAgentsByCapability(capability);
        
        if (agents.length === 0) {
          return JSON.stringify({
            type: 'error',
            content: `No agents found with capability: ${capability}`
          });
        }

        // For now, use the first agent found
        // Could be extended to implement more sophisticated agent selection
        const targetAgent = agents[0];

        // Prepare the message
        const messageData = {
          type: 'request',
          content: message,
          metadata,
          timestamp: Date.now()
        };

        if (requireResponse) {
          // Create a promise that will be resolved when the response is received
          const response = await new Promise((resolve) => {
            // Store the resolve function to be called when response is received
            protocol.pendingResponses.set(targetAgent.peerId, resolve);
            
            // Send the message
            protocol.sendMessage(targetAgent.peerId, messageData);
          });

          return JSON.stringify(response);
        } else {
          // Fire and forget
          await protocol.sendMessage(targetAgent.peerId, messageData);
          return JSON.stringify({
            type: 'response',
            content: 'Message sent successfully'
          });
        }
      } catch (error) {
        return JSON.stringify({
          type: 'error',
          content: `Error communicating with agent: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    },
  });
}

export function createAgentDiscoveryTool(protocol) {
  return new DynamicStructuredTool({
    name: "discover_agents",
    description: "Search for agents with specific capabilities",
    schema: z.object({
      capability: z.string().describe("The capability to search for"),
      includeMetadata: z.boolean().optional().describe("Whether to include full agent metadata")
    }),
    func: async ({ capability, includeMetadata = false }) => {
      try {
        const agents = await protocol.findAgentsByCapability(capability);
        
        if (includeMetadata) {
          return JSON.stringify(agents, null, 2);
        } else {
          return JSON.stringify(
            agents.map(agent => ({
              name: agent.name,
              peerId: agent.peerId
            })),
            null,
            2
          );
        }
      } catch (error) {
        return JSON.stringify({
          type: 'error',
          content: `Error discovering agents: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    },
  });
}