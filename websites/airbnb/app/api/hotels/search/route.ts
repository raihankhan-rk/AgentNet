import { NextResponse } from "next/server";
import { getAllHotels } from '@/services/hotelService';

const DATE_RANGE_BUFFER = 3; // Number of days to check before and after

function isDateWithinRange(
  date: string,
  targetDate: string,
  buffer: number,
): boolean {
  const dateObj = new Date(date);
  const targetObj = new Date(targetDate);
  const diffTime = Math.abs(dateObj.getTime() - targetObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= buffer;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get("place");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const occupants = searchParams.get("occupants");

  // Get hotels from service
  const hotels = await getAllHotels();

  // First filter by place if provided
  let filteredHotels = hotels;
  if (place) {
    filteredHotels = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(place.toLowerCase())
    );
  }

  // Then check dates for the filtered hotels
  const hotelsWithDates = filteredHotels.map((hotel) => {
    let dateMatches: string[] = [];
    if (checkIn && checkOut) {
      // Check if the hotel has availability for the entire stay period
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      dateMatches = hotel.availableDates.filter((date) => {
        const currentDate = new Date(date);
        return currentDate >= checkInDate && currentDate <= checkOutDate;
      });

      return {
        ...hotel,
        matchesExactDates: dateMatches.length > 0,
        nearbyDates: dateMatches,
        isNearDesiredDates: dateMatches.length > 0,
      };
    }

    return {
      ...hotel,
      matchesExactDates: true,
      nearbyDates: [],
      isNearDesiredDates: true,
    };
  });

  // Sort hotels: exact matches first, then nearby dates
  const sortedHotels = hotelsWithDates.sort((a, b) => {
    if (a.matchesExactDates && !b.matchesExactDates) return -1;
    if (!a.matchesExactDates && b.matchesExactDates) return 1;
    return 0;
  });

  return NextResponse.json(sortedHotels);
}
