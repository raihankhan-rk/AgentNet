import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

interface Hotel {
  id: string;
  name: string;
  place: string;
  price: number;
  rating: number;
  amenities: string[];
  images: string[];
}

interface Booking {
  id: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
}

export function createSearchHotelsTool() {
  return new DynamicStructuredTool({
    name: "search_hotels",
    description: "Search for available hotels with optional filters for location, dates, and number of guests",
    schema: z.object({
      place: z.string().optional().describe("Optional location/city name"),
      checkIn: z.string().optional().describe("Optional check-in date in YYYY-MM-DD format"),
      checkOut: z.string().optional().describe("Optional check-out date in YYYY-MM-DD format"),
      occupants: z.number().optional().describe("Optional number of guests"),
    }),
    func: async ({ place, checkIn, checkOut, occupants }) => {
      try {
        console.log(`invoking \`search_hotels\` with filters:`, { place, checkIn, checkOut, occupants });
        const params = new URLSearchParams();
        if (place) params.append("place", encodeURIComponent(place));
        if (checkIn) params.append("checkIn", encodeURIComponent(checkIn));
        if (checkOut) params.append("checkOut", encodeURIComponent(checkOut));
        if (occupants) params.append("occupants", occupants.toString());

        const response = await fetch(
          `https://web4-airbnb.vercel.app/api/hotels/search?${params}`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const hotels: Hotel[] = await response.json();
        return JSON.stringify(hotels, null, 2);
      } catch (error) {
        return `Error searching hotels: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

export function createGetHotelDetailsTool() {
  return new DynamicStructuredTool({
    name: "get_hotel_details",
    description: "Get detailed information about a specific hotel by its ID",
    schema: z.object({
      hotelId: z.string().describe("ID of the hotel to get details for"),
    }),
    func: async ({ hotelId }) => {
      try {
        console.log(`invoking \`get_hotel_details\` with hotelId=${hotelId}`);
        const response = await fetch(`https://web4-airbnb.vercel.app/api/hotels/${hotelId}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const hotel: Hotel = await response.json();
        return JSON.stringify(hotel, null, 2);
      } catch (error) {
        return `Error getting hotel details: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

export function createBookHotelTool() {
  return new DynamicStructuredTool({
    name: "book_hotel",
    description: "Book a hotel room for specified dates and number of guests",
    schema: z.object({
      hotelId: z.string().describe("ID of the hotel to book"),
      checkIn: z.string().describe("Check-in date in YYYY-MM-DD format"),
      checkOut: z.string().describe("Check-out date in YYYY-MM-DD format"),
      guests: z.number().describe("Number of guests"),
    }),
    func: async ({ hotelId, checkIn, checkOut, guests }) => {
      try {
        console.log(`invoking \`book_hotel\` with:`, { hotelId, checkIn, checkOut, guests });
        const response = await fetch(`https://web4-airbnb.vercel.app/api/hotels/${hotelId}/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkIn,
            checkOut,
            guests,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const booking: Booking = await response.json();
        return JSON.stringify(booking, null, 2);
      } catch (error) {
        return `Error booking hotel: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}

export function createGetBookingsTool() {
  return new DynamicStructuredTool({
    name: "get_bookings",
    description: "Retrieve all hotel bookings for the user",
    schema: z.object({}), // No parameters needed
    func: async () => {
      try {
        console.log(`invoking \`get_bookings\``);
        const response = await fetch("https://web4-airbnb.vercel.app/api/bookings");
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const bookings: Booking[] = await response.json();
        return JSON.stringify(bookings, null, 2);
      } catch (error) {
        return `Error retrieving bookings: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}
