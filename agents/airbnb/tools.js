import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

export function createSearchHotelsTool() {
    return new DynamicStructuredTool({
        name: "search_hotels",
        description: "Search for hotels based on location and dates",
        schema: z.object({
            place: z.string().describe("Location to search for"),
            checkIn: z.string().describe("Check-in date (YYYY-MM-DD)"),
            checkOut: z.string().optional().describe("Check-out date (YYYY-MM-DD)"),
            occupants: z.number().optional().describe("Number of guests")
        }),
        func: async ({ place, checkIn, checkOut, occupants }) => {
            try {
                const params = new URLSearchParams({
                    place,
                    checkIn,
                    ...(checkOut && { checkOut }),
                    ...(occupants && { occupants: occupants.toString() })
                });

                const response = await fetch(`https://web4-airbnb.vercel.app/api/hotels/search?${params}`);
                const hotels = await response.json();
                return JSON.stringify(hotels, null, 2);
            } catch (error) {
                return `Error searching hotels: ${error.message}`;
            }
        }
    });
}

export function createGetHotelDetailsTool() {
    return new DynamicStructuredTool({
        name: "get_hotel_details",
        description: "Get detailed information about a specific hotel",
        schema: z.object({
            hotelId: z.string().describe("ID of the hotel")
        }),
        func: async ({ hotelId }) => {
            try {
                const response = await fetch(`https://web4-airbnb.vercel.app/api/hotels/${hotelId}`);
                const hotel = await response.json();
                return JSON.stringify(hotel, null, 2);
            } catch (error) {
                return `Error getting hotel details: ${error.message}`;
            }
        }
    });
}

export function createBookHotelTool() {
    return new DynamicStructuredTool({
        name: "book_hotel",
        description: "Book a hotel for specified dates",
        schema: z.object({
            hotelId: z.string().describe("ID of the hotel to book"),
            checkIn: z.string().describe("Check-in date (YYYY-MM-DD)"),
            checkOut: z.string().describe("Check-out date (YYYY-MM-DD)"),
            guests: z.number().describe("Number of guests")
        }),
        func: async ({ hotelId, checkIn, checkOut, guests }) => {
            try {
                const response = await fetch(`https://web4-airbnb.vercel.app/api/hotels/${hotelId}/book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ checkIn, checkOut, guests })
                });
                const booking = await response.json();
                return JSON.stringify(booking, null, 2);
            } catch (error) {
                return `Error booking hotel: ${error.message}`;
            }
        }
    });
}

export function createGetBookingsTool() {
    return new DynamicStructuredTool({
        name: "get_bookings",
        description: "Retrieve all hotel bookings",
        schema: z.object({}),
        func: async () => {
            try {
                const response = await fetch("https://web4-airbnb.vercel.app/api/bookings");
                const bookings = await response.json();
                return JSON.stringify(bookings, null, 2);
            } catch (error) {
                return `Error retrieving bookings: ${error.message}`;
            }
        }
    });
} 