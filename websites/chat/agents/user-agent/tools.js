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
            try {
                // Use cached agents if available, otherwise search
                if (!cachedAgents[capability]) {
                    cachedAgents[capability] = await protocol.findAgentsByCapability(capability.trim().toLowerCase());
                }
                
                if (cachedAgents[capability].length === 0) {
                    return JSON.stringify({
                        type: 'error',
                        content: `No agents found with capability: ${capability}`
                    });
                }

                const targetAgent = cachedAgents[capability][0];
                const messageData = {
                    type: 'request',
                    content: message,
                    metadata: {
                        ...metadata,
                        parallel
                    },
                    timestamp: Date.now()
                };

                if (requireResponse) {
                    const response = await protocol.sendMessage(targetAgent.peerId, messageData);
                    return JSON.stringify(response);
                } else {
                    await protocol.sendMessage(targetAgent.peerId, messageData);
                    return JSON.stringify({
                        type: 'response',
                        content: 'Message sent successfully'
                    });
                }
            } catch (error) {
                // Clear cache on error
                delete cachedAgents[capability];
                return JSON.stringify({
                    type: 'error',
                    content: `Communication failed: ${error.message}`
                });
            }
        },
    });
}

export function createMultiAgentCommunicationTool(protocol) {
    return new DynamicStructuredTool({
        name: "communicate_with_multiple_agents",
        description: "Communicate with multiple agents in parallel",
        schema: z.object({
            requests: z.array(z.object({
                capability: z.string(),
                message: z.string(),
                metadata: z.record(z.any()).optional()
            })).describe("Array of requests to different agents")
        }),
        func: async ({ requests }) => {
            try {
                const responses = await Promise.all(
                    requests.map(async (request) => {
                        const agents = await protocol.findAgentsByCapability(request.capability.trim().toLowerCase());
                        if (agents.length === 0) {
                            return {
                                capability: request.capability,
                                type: 'error',
                                content: `No agents found with capability: ${request.capability}`
                            };
                        }

                        const targetAgent = agents[0];
                        const messageData = {
                            type: 'request',
                            content: request.message,
                            metadata: request.metadata || {},
                            timestamp: Date.now()
                        };

                        const response = await protocol.sendMessage(targetAgent.peerId, messageData);
                        return {
                            capability: request.capability,
                            ...response
                        };
                    })
                );

                return JSON.stringify(responses);
            } catch (error) {
                return JSON.stringify({
                    type: 'error',
                    content: `Parallel communication failed: ${error.message}`
                });
            }
        }
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

export function createAgentWalletTool(protocol) {
  return new DynamicStructuredTool({
    name: "get_agent_wallet",
    description: "Get the wallet address for a specific agent capability (e.g., flight-booking, accommodation-booking)",
    schema: z.object({
      capability: z.string().describe("The capability to search for (e.g., 'flight-booking', 'accommodation-booking')"),
    }),
    func: async ({ capability }) => {
        console.log("invoking `get_agent_wallet` with capability ", capability)
      try {
        const agents = await protocol.findAgentsByCapability(capability.trim().toLowerCase());
        
        if (agents.length === 0) {
          return JSON.stringify({
            type: 'error',
            content: `No agents found with capability: ${capability}`
          });
        }

        const agent = agents[0];
        if (!agent.walletAddress) {
          return JSON.stringify({
            type: 'error',
            content: `No wallet address available for agent with capability: ${capability}`
          });
        }

        return JSON.stringify({
          type: 'success',
          content: {
            capability,
            agentName: agent.name,
            walletAddress: agent.walletAddress
          }
        });
      } catch (error) {
        return JSON.stringify({
          type: 'error',
          content: `Error getting agent wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    },
  });
}