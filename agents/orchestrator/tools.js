import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

export function createAgentCommunicationTool(protocol) {
  let cachedAgents = null;  // Cache for the current request

  return new DynamicStructuredTool({
    name: "communicate_with_agent",
    description: "Communicate with another agent based on capability",
    schema: z.object({
      capability: z.string().describe("The capability to search for"),
      message: z.string().describe("The message to send"),
      requireResponse: z.boolean().optional().describe("Whether to wait for response"),
      metadata: z.record(z.any()).optional().describe("Additional metadata"),
    }),
    func: async ({ capability, message, requireResponse = true, metadata = {} }) => {
      try {
        // Use cached agents if available, otherwise search
        if (!cachedAgents) {
          cachedAgents = await protocol.findAgentsByCapability(capability.trim().toLowerCase());
        }
        
        if (cachedAgents.length === 0) {
          return JSON.stringify({
            type: 'error',
            content: `No agents found with capability: ${capability}`
          });
        }

        const targetAgent = cachedAgents[0];
        const messageData = {
          type: 'request',
          content: message,
          metadata,
          timestamp: Date.now()
        };

        if (requireResponse) {
          const response = await protocol.sendMessage(targetAgent.peerId, messageData);
          // Clear cache after successful communication
          cachedAgents = null;
          return JSON.stringify(response);
        } else {
          await protocol.sendMessage(targetAgent.peerId, messageData);
          // Clear cache after successful communication
          cachedAgents = null;
          return JSON.stringify({
            type: 'response',
            content: 'Message sent successfully'
          });
        }
      } catch (error) {
        // Clear cache on error
        cachedAgents = null;
        return JSON.stringify({
          type: 'error',
          content: `Communication failed: ${error.message}`
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
      capability: z.string().describe("The capability to search for (use 'flight-booking' for flight related tasks)"),
      includeMetadata: z.boolean().optional().describe("Whether to include full agent metadata")
    }),
    func: async ({ capability, includeMetadata = false }) => {
      try {
        const agents = await protocol.findAgentsByCapability(capability.trim().toLowerCase());
        
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