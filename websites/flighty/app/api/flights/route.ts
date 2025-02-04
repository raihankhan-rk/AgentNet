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
    // const startDate = new Date(selectedDate);
    // startDate.setDate(selectedDate.getDate() - 3);
    // const endDate = new Date(selectedDate);
    // endDate.setDate(selectedDate.getDate() + 3);
    

    
    // update the flight departureTime to the startDate
    flights.forEach(flight => {
      flight.departureTime = selectedDate.toISOString();
      // Adjust the arrival time by adding 2 hours to the departure time
      const departureTime = new Date(selectedDate);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(departureTime.getHours() + 2);
      flight.arrivalTime = arrivalTime.toISOString();

      // Adjust the boarding time by subtracting 30 minutes from the departure time
      const boardingTime = new Date(departureTime);
      boardingTime.setMinutes(departureTime.getMinutes() - 30);
      flight.boardingTime = boardingTime.toISOString();

    });

    console.log("flights:", flights, selectedDate);

  }

  return NextResponse.json(flights);
} 