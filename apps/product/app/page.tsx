import FlightSearch from '@/components/FlightSearch';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Flight Booking System
      </h1>
      <FlightSearch />
    </main>
  );
}
