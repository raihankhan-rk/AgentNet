import BookingForm from '@/components/BookingForm';
import { Hotel } from '@/types';

async function getHotel(id: string) {
  const res = await fetch(`http://localhost:3000/api/hotels/${id}`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function HotelPage(request: any) {
  const hotel = await getHotel(request.params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Hotel Details</h2>
              <p className="text-gray-600 mb-2">{hotel.description}</p>
              <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
              <p className="font-bold text-lg">${hotel.price}/night</p>
            </div>
          </div>
          <div>
            <BookingForm hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
} 