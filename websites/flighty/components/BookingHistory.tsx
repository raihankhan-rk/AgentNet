'use client';

import { useState, useEffect } from 'react';
import { Ticket } from '@/types/flight';

export default function BookingHistory() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No bookings found</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border-2 relative border-dashed border-gray-300 rounded-lg p-6 bg-white shadow-sm overflow-hidden"
            >
              {/* Decorative circle cuts for the boarding pass effect */}
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full transform -translate-y-1/2"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">Boarding Pass</span>
                  <h3 className="font-bold text-xl">Ticket #{ticket.id}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {ticket.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Passenger</p>
                  <p className="font-semibold">{ticket.travellerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Flight</p>
                  <p className="font-semibold">{ticket.flightId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-semibold">{new Date(ticket.bookingTime).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Time</p>
                  <p className="font-semibold">{new Date(ticket.bookingTime).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Fake barcode */}
              <div className=" absolute bottom-5 right-5 flex justify-end items-center mt-4">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-[2px]">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[2px] bg-gray-800"
                        style={{
                          height: `${Math.random() * 20 + 30}px`
                        }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{ticket.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 