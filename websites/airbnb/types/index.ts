export interface Booking {
  id: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  maxOccupants: number;
  images: string[];
  description: string;
  availableDates: string[];
  bookings: Booking[];
  matchesExactDates?: boolean;
  nearbyDates?: string[];
  isNearDesiredDates?: boolean;
}

export interface SearchParams {
  place: string;
  checkIn: string;
  checkOut: string;
  occupants: number;
} 