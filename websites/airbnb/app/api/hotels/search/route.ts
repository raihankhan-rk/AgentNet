import { NextResponse } from 'next/server';
import hotelsData from '@/data/hotels.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get('place');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const occupants = searchParams.get('occupants');

  // Use the hotels data from the JSON file
  const hotels = hotelsData.hotels;

  const filteredHotels = hotels.filter(hotel => {
    const matchesPlace = place 
      ? hotel.location.toLowerCase().includes(place.toLowerCase())
      : true;
    
    // Remove occupants check for now since it's not in our data structure
    
    // Check if the dates are available
    const matchesDates = checkIn && checkOut
      ? hotel.availableDates.some(date => 
          date >= checkIn && date <= checkOut
        )
      : true;

    return matchesPlace && matchesDates;
  });

  return NextResponse.json(filteredHotels);
} 