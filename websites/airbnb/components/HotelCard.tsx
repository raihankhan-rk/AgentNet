import { Hotel } from '@/types';
import Link from 'next/link';

interface Props {
  hotel: Hotel & {
    matchesExactDates: boolean;
    nearbyDates: string[];
    isNearDesiredDates: boolean;
  };
}

export default function HotelCard({ hotel }: Props) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-2">{hotel.name}</h2>
      <p className="text-gray-600 mb-2">{hotel.description}</p>
      <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
      
      {hotel.matchesExactDates ? (
        <p className="text-green-600 mb-2">✓ Available for your dates</p>
      ) : hotel.isNearDesiredDates ? (
        <div className="mb-2">
          <p className="text-orange-600">⚠ Not available for exact dates</p>
          <p className="text-sm text-gray-600">Available nearby dates:</p>
          <ul className="text-sm text-gray-600">
            {hotel.nearbyDates.map(date => (
              <li key={date}>{new Date(date).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      ) : null}
      
      <div className="flex justify-between items-center mt-4">
        <p className="font-bold text-lg">${hotel.price}/night</p>
        <Link 
          href={`/hotels/${hotel.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
} 