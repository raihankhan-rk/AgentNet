import { NextResponse } from 'next/server';
import { Ticket } from '@/types/flight';

// In a real app, this would be stored in a database
let bookings: Ticket[] = [];

export async function GET() {
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { flightId, travellerName } = body;

    const ticket: Ticket = {
      id: `TKT${Math.random().toString(36).substr(2, 9)}`,
      flightId,
      travellerName,
      bookingTime: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    // In a real app, this would be saved to a database
    bookings.push(ticket);

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 