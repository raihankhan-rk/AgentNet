'use client';

import { Hotel } from '@/types';
import { useState } from 'react';

interface Props {
  hotel: Hotel;
}

export default function BookingForm({ hotel }: Props) {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/hotels/${hotel.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`Booking successful! Total price: $${data.booking.totalPrice}`);
        window.location.reload();
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Book Your Stay</h2>
      <div className="mb-4">
        <label className="block mb-2">Check-in Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.checkIn}
          onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Check-out Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.checkOut}
          onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
          min={formData.checkIn || new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2">Number of Guests</label>
        <input
          type="number"
          min="1"
          max="10"
          className="w-full p-2 border rounded"
          value={formData.guests}
          onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
} 