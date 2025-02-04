import { useState } from 'react';
import { Flight } from '@/types/flight';

interface BookingModalProps {
  flight: Flight;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ flight, onClose, onSuccess }: BookingModalProps) {
  const [travellerName, setTravellerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flight.id,
          travellerName,
        }),
      });

      if (!response.ok) throw new Error('Booking failed');

      const ticket = await response.json();
      onSuccess();
    } catch (err) {
      setError('Failed to book ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Book Flight</h2>
        <p className="mb-4 text-gray-700">
          {flight.departureLocation} → {flight.arrivalLocation}
          <br />
          {new Date(flight.departureTime).toLocaleString()}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Traveller Name"
            value={travellerName}
            onChange={(e) => setTravellerName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 