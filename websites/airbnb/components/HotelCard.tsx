import { Hotel } from '@/types';
import Link from 'next/link';

interface Props {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: Props) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-2">{hotel.name}</h2>
      <p className="text-gray-600 mb-2">{hotel.description}</p>
      <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
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