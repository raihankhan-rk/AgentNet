import { useState } from 'react';
import { Flight } from '@/types/flight';
import { Plane, ArrowRight } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Plane className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-800">{flight.airlineName}</p>
              <div className="flex items-center space-x-3 text-sm text-slate-500">
                <span className="font-medium">
                  {new Date(flight.departureTime).toLocaleTimeString()}
                </span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(flight.arrivalTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-800">${flight.ticketPrice}</p>
              <p className="text-sm text-slate-500">per person</p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={isBooked}
              className={`px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isBooked
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isBooked ? 'Booked!' : 'Select'}
            </button>
          </div>
        </div>
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