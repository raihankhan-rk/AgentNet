'use client';

import { useState } from 'react';
import Search from './components/Search';
import { Hotel } from '@/types';
import HotelCard from '@/components/HotelCard';

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchParams: any) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        place: searchParams.place,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        occupants: searchParams.occupants.toString()
      }).toString();

      const response = await fetch(`/api/hotels/search?${queryString}`);
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error searching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Your Perfect Stay</h1>
      <Search onSearch={handleSearch} />
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: Hotel) => (
            <HotelCard 
              key={hotel.id} 
              hotel={{
                ...hotel,
                matchesExactDates: hotel.matchesExactDates ?? false,
                nearbyDates: hotel.nearbyDates ?? [],
                isNearDesiredDates: hotel.isNearDesiredDates ?? false
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
