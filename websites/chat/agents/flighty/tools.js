import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

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
        console.log(`invoking \`search_flights\` with filters: from=${from}, to=${to}, date=${date}`);
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
        
        const flights = await response.json();
        return JSON.stringify(flights, null, 2);
      } catch (error) {
        return `Error searching flights: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

// Tool to retrieve all bookings
export function createGetBookingsTool() {
  return new DynamicStructuredTool({
    name: "get_bookings",
    description: "Retrieve all flight bookings",
    schema: z.object({}), // No parameters needed
    func: async () => {
      try {
        console.log(`invoking \`get_bookings\``);
        const response = await fetch("https://web4-flighty.vercel.app/api/bookings");
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const bookings = await response.json();
        return JSON.stringify(bookings, null, 2);
      } catch (error) {
        return `Error retrieving bookings: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

// Tool to create a new booking
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
        console.log(`invoking \`book_flight\` with flightId=${flightId}, travellerName=${travellerName}`);
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
        
        const booking = await response.json();
        return JSON.stringify(booking, null, 2);
      } catch (error) {
        return `Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

export function createTransactionVerificationTool() {
  return new DynamicStructuredTool({
      name: "verify_payment",
      description: "Verify if a payment was successful using the transaction hash",
      schema: z.object({
          txHash: z.string().describe("The transaction hash to verify"),
      }),
      func: async ({ txHash }) => {
          try {
              const response = await fetch(
                  `https://api-sepolia.basescan.org/api?module=transaction&action=getstatus&txhash=${txHash}&apikey=W4355Z3SH791XK4JPPFX5VPW1JK9XKUYBV`
              );
              
              if (!response.ok) {
                  throw new Error(`API request failed with status ${response.status}`);
              }
              
              const data = await response.json();
              const isError = data.result.isError;
              const isVerified = isError === "0";
              
              console.log(`Payment verification ${isVerified ? 'successful' : 'failed'} for transaction ${txHash}`);
              
              return JSON.stringify({
                  type: isVerified ? "success" : "error", 
                  content: {
                      verified: isVerified,
                      message: isVerified ? "Transaction successful" : "Transaction failed"
                  }
              });
          } catch (error) {
              console.log(`Payment verification failed with error: ${error.message}`);
              return JSON.stringify({
                  type: "error",
                  content: `Error verifying transaction: ${error.message}`
              });
          }
      }
  });
}