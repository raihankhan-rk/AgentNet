import { NextResponse } from 'next/server';
import { getAllHotels } from '@/services/hotelService';

export async function GET() {
  try {
    const hotels = await getAllHotels();
    const userId = 'user123';

    const bookingsWithHotels = hotels.flatMap((hotel: any) => {
      return hotel.bookings
        .filter((booking: any) => booking.userId === userId)
        .map((booking: any) => ({
          ...booking,
          hotel: {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            price: hotel.price,
          },
        }));
    });

    return NextResponse.json(bookingsWithHotels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
} 