'use client';

import { useState, useEffect } from 'react';
import { Booking, Hotel } from '@/types';

interface BookingWithHotel extends Booking {
  hotel: Hotel;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2">{booking.hotel.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p className="text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Guests: {booking.guests}</p>
                <p className="font-bold">Total Price: ${booking.totalPrice}</p>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-center text-gray-600">No bookings found.</p>
        )}
      </div>
    </div>
  );
} 