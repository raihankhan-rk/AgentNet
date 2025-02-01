import { NextResponse } from 'next/server';
import hotelsData from '@/data/hotels.json';

const DATE_RANGE_BUFFER = 3; // Number of days to check before and after

function isDateWithinRange(date: string, targetDate: string, buffer: number): boolean {
  const dateObj = new Date(date);
  const targetObj = new Date(targetDate);
  const diffTime = Math.abs(dateObj.getTime() - targetObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= buffer;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get('place');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const occupants = searchParams.get('occupants');

  // Use the hotels data from the JSON file
  const hotels = hotelsData.hotels;

  // First filter by place if provided
  let filteredHotels = hotels;
  if (place) {
    filteredHotels = hotels.filter(hotel => 
      hotel.location.toLowerCase().includes(place.toLowerCase())
    );
  }

  // Then check dates for the filtered hotels
  const hotelsWithDates = filteredHotels.map(hotel => {
    let dateMatches: string[] = [];
    if (checkIn && checkOut) {
      dateMatches = hotel.availableDates.filter(date => {
        return isDateWithinRange(date, checkIn, DATE_RANGE_BUFFER) || 
               isDateWithinRange(date, checkOut, DATE_RANGE_BUFFER);
      });
    }

    return {
      ...hotel,
      matchesExactDates: checkIn && checkOut ? hotel.availableDates.some(date => 
        date >= checkIn && date <= checkOut
      ) : true,
      nearbyDates: dateMatches,
      isNearDesiredDates: dateMatches.length > 0
    };
  }).filter(hotel => {
    return hotel.matchesExactDates || hotel.isNearDesiredDates;
  });

  // Sort hotels: exact matches first, then nearby dates
  const sortedHotels = hotelsWithDates.sort((a, b) => {
    if (a.matchesExactDates && !b.matchesExactDates) return -1;
    if (!a.matchesExactDates && b.matchesExactDates) return 1;
    return 0;
  });

  return NextResponse.json(sortedHotels);
} 