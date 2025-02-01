import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'hotels.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // In a real app, you would filter by the authenticated user's ID
    const userId = 'user123';

    const bookingsWithHotels = data.hotels.flatMap((hotel: any) => {
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