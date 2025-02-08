import { NextResponse } from 'next/server';
import { getAllHotels } from '@/services/hotelService';

export async function GET() {
  const hotels = await getAllHotels();
  return NextResponse.json(hotels);
} 