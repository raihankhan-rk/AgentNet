import { useState } from 'react';
import { Flight } from '@/types/flight';
import BookingModal from './BookingModal';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setIsBooked(true);
  };

  return (
    <>
      <div className="border rounded p-4 bg-white hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">{flight.airlineName}</h3>
            <p className="text-sm text-gray-600">Flight {flight.id}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">${flight.ticketPrice}</p>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <div>
            <p className="font-semibold text-gray-900">{flight.departureLocation}</p>
            <p className="text-sm text-gray-600">
              {new Date(flight.departureTime).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">{flight.arrivalLocation}</p>
            <p className="text-sm text-gray-600">
              {new Date(flight.arrivalTime).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowBookingModal(true)}
          disabled={isBooked}
          className={`mt-4 w-full py-2 rounded ${
            isBooked
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isBooked ? 'Booked!' : 'Book Now'}
        </button>
      </div>

      {showBookingModal && (
        <BookingModal
          flight={flight}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
} 