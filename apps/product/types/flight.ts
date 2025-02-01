export interface Flight {
  id: string;
  departureTime: string;
  arrivalTime: string;
  boardingTime: string;
  departureLocation: string;
  arrivalLocation: string;
  airlineName: string;
  ticketPrice: number;
}

export interface Ticket {
  id: string;
  flightId: string;
  travellerName: string;
  bookingTime: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
} 