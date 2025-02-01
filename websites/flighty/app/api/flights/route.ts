import { Flight } from '@/types/flight';
import flightData from '@/data/flights.json';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  let flights = flightData.flights;

  if (from) {
    flights = flights.filter(flight => 
      flight.departureLocation.toLowerCase().includes(from.toLowerCase())
    );
  }

  if (to) {
    flights = flights.filter(flight => 
      flight.arrivalLocation.toLowerCase().includes(to.toLowerCase())
    );
  }

  if (date) {
    flights = flights.filter(flight => 
      flight.departureTime.startsWith(date)
    );
  }

  return NextResponse.json(flights);
} 