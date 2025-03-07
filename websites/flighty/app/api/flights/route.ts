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
    // flights = flights.filter(flight => 
    //   flight.departureTime.startsWith(date)
    // );
    const selectedDate = new Date(date);
  
    // update the flight departureTime to the startDate
    flights.forEach(flight => {
      flight.departureTime = selectedDate.toISOString();
      const departureTime = new Date(selectedDate);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(departureTime.getHours() + 2);
      flight.arrivalTime = arrivalTime.toISOString();

      const boardingTime = new Date(departureTime);
      boardingTime.setMinutes(departureTime.getMinutes() - 30);
      flight.boardingTime = boardingTime.toISOString();

    });

    console.log("flights:", flights, selectedDate);

  }

  return NextResponse.json(flights);
} 