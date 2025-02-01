import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";
import { Flight, Ticket } from "../../websites/flighty/types/flight";

/**
 * Creates a tool to search for flights using the Flighty API
 */
export function createFlightSearchTool() {
  return new DynamicStructuredTool({
    name: "search_flights",
    description: "Search for available flights with optional filters for departure location, arrival location, and date",
    schema: z.object({
      from: z.string().optional().describe("Optional departure city"),
      to: z.string().optional().describe("Optional arrival city"),
      date: z.string().optional().describe("Optional travel date in YYYY-MM-DD format"),
    }),
    func: async ({ from, to, date }) => {
      try {
        console.log("Searching flights with filters:", { from, to, date });
        const params = new URLSearchParams();
        if (from) params.append("from", encodeURIComponent(from));
        if (to) params.append("to", encodeURIComponent(to));
        if (date) params.append("date", encodeURIComponent(date));

        const response = await fetch(
          `https://web4-flighty.vercel.app/api/flights?${params}`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const flights: Flight[] = await response.json();
        return JSON.stringify(flights, null, 2);
      } catch (error) {
        return `Error searching flights: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

/**
 * Creates a tool to retrieve all bookings
 */
export function createGetBookingsTool() {
  return new DynamicStructuredTool({
    name: "get_bookings",
    description: "Retrieve all flight bookings",
    schema: z.object({}), // No parameters needed
    func: async () => {
      try {
        console.log("Retrieving all bookings");
        const response = await fetch("https://web4-flighty.vercel.app/api/bookings");
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const bookings: Ticket[] = await response.json();
        return JSON.stringify(bookings, null, 2);
      } catch (error) {
        return `Error retrieving bookings: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

/**
 * Creates a tool to create a new booking
 */
export function createBookFlightTool() {
  return new DynamicStructuredTool({
    name: "book_flight",
    description: "Create a new flight booking for a specific flight and traveller",
    schema: z.object({
      flightId: z.string().describe("ID of the flight to book"),
      travellerName: z.string().describe("Full name of the traveller"),
    }),
    func: async ({ flightId, travellerName }) => {
      try {
        console.log("Creating booking for flight", flightId, "traveller:", travellerName);
        const response = await fetch("https://web4-flighty.vercel.app/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flightId,
            travellerName,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const booking: Ticket = await response.json();
        return JSON.stringify(booking, null, 2);
      } catch (error) {
        return `Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}
