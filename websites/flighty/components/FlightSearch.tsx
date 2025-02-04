'use client';

import { useState } from 'react';
import { Flight } from '@/types/flight';
import FlightCard from './FlightCard';
import { MapPin, Calendar, Search } from 'lucide-react';

export default function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedDate = new Date(date);
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate());
    // const endDate = new Date(selectedDate);
    // endDate.setDate(selectedDate.getDate() + 3);

    const params = new URLSearchParams({
      from,
      to,
      date: startDate.toISOString().split('T')[0]
    });

    const response = await fetch(`/api/flights?${params}`);
    const data = await response.json();
    setFlights(data);
  };

  return (
    <>
      <div className="container mx-auto px-4 -mt-28 relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transition-all duration-500 hover:bg-white">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2 group">
                <label className="block text-sm font-medium text-slate-700">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Origin city"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium text-slate-700">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Destination city"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Flights
              </button>
            </div>
          </form>
        </div>
      </div>

      {flights.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-medium text-slate-800 mb-8">Available Flights</h2>
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      )}
    </>
  );
} 