import FlightSearch from '@/components/FlightSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div 
        className="h-[60vh] bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl text-white font-extralight mb-6 tracking-tight">
              Discover Your Next Journey
            </h1>
            <p className="text-xl text-slate-200 font-light">
              Book flights to anywhere in the world with ease
            </p>
          </div>
        </div>
      </div>
      <FlightSearch />
    </main>
  );
}
