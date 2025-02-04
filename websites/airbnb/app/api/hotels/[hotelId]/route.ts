import { NextResponse } from 'next/server';
import { getHotelById } from '@/services/hotelService';

export async function GET(request: Request) {
  try {
    // Get hotelId from URL
    const hotelId = request.url.split('/').pop();
    if (!hotelId) {
      return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 });
    }
    
    const hotel = await getHotelById(hotelId);
    
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
} 