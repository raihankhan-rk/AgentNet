import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { checkIn, checkOut, guests } = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'hotels.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const hotel = data.hotels.find((h: any) => h.id === params.hotelId);
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    // Calculate number of nights
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    const booking = {
      id: uuidv4(),
      userId: 'user123', // In a real app, this would come from authentication
      checkIn,
      checkOut,
      guests,
      totalPrice: hotel.price * nights
    };

    hotel.bookings.push(booking);
    
    // Remove booked dates from availableDates
    hotel.availableDates = hotel.availableDates.filter((date: any) => 
      date < checkIn || date > checkOut
    );

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
} 