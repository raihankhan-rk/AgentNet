import BookingHistory from '@/components/BookingHistory';

export default function BookingsPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Booking History
      </h1>
      <BookingHistory />
    </main>
  );
} 