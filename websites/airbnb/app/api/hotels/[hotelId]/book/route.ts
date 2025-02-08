import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { bookHotel, getHotelById } from '@/services/hotelService';

export async function POST(request: Request) {
  try {
    // Extract hotelId from URL
    const hotelId = request.url.split('/hotels/')[1].split('/')[0];
    
    const { checkIn, checkOut, guests } = await request.json();

    const hotel = await getHotelById(hotelId);
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
      hotelId,
      checkIn,
      checkOut,
      guests,
      totalPrice: hotel.price * nights
    };

    await bookHotel(hotelId, booking);

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
} 