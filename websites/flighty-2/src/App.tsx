import React, { useState } from 'react';
import { Plane, Search, MapPin, Calendar, ArrowRight, X, Loader2 } from 'lucide-react';

// Dummy data for flights
const FLIGHTS = [
  {
    id: 1,
    from: 'New York (JFK)',
    to: 'London (LHR)',
    date: '2024-03-25',
    price: 549,
    airline: 'SkyWings Airlines',
    duration: '7h 20m',
    departureTime: '09:30',
    arrivalTime: '21:50',
    gate: 'B22',
    seat: '12A',
    flightNumber: 'SW 1234'
  },
  {
    id: 2,
    from: 'New York (JFK)',
    to: 'London (LHR)',
    date: '2024-03-25',
    price: 649,
    airline: 'Atlantic Airways',
    duration: '7h 05m',
    departureTime: '14:15',
    arrivalTime: '02:20',
    gate: 'C15',
    seat: '18F',
    flightNumber: 'AA 5678'
  },
  {
    id: 3,
    from: 'New York (JFK)',
    to: 'London (LHR)',
    date: '2024-03-25',
    price: 489,
    airline: 'Global Express',
    duration: '7h 45m',
    departureTime: '18:45',
    arrivalTime: '07:30',
    gate: 'A10',
    seat: '24C',
    flightNumber: 'GE 9012'
  }
];

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<typeof FLIGHTS[0] | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showBoardingPass, setShowBoardingPass] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
    setSelectedFlight(null);
    setShowBoardingPass(false);
    setBookingComplete(false);
  };

  const handleSelectFlight = (flight: typeof FLIGHTS[0]) => {
    setSelectedFlight(flight);
    setIsBooking(true);
  };

  const handleBookFlight = async () => {
    setBookingComplete(false);
    // Simulate booking process
    const loader = document.querySelector('.booking-loader');
    if (loader) {
      loader.classList.add('animate-spin');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (loader) {
      loader.classList.remove('animate-spin');
    }
    
    setBookingComplete(true);
    setIsBooking(false);
    setShowBoardingPass(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section with Parallax Effect */}
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

      {/* Search Form */}
      <div className="container mx-auto px-4 -mt-28 relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transition-all duration-500 hover:bg-white">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2 group">
                <label className="block text-sm font-medium text-slate-700">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Origin city"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium text-slate-700">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination city"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Flights
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-medium text-slate-800 mb-8">Available Flights</h2>
          <div className="space-y-4">
            {FLIGHTS.map((flight) => (
              <div 
                key={flight.id} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Plane className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-800">{flight.airline}</p>
                      <div className="flex items-center space-x-3 text-sm text-slate-500">
                        <span className="font-medium">{flight.departureTime}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">{flight.arrivalTime}</span>
                        <span className="text-slate-400">({flight.duration})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-800">${flight.price}</p>
                      <p className="text-sm text-slate-500">per person</p>
                    </div>
                    <button 
                      onClick={() => handleSelectFlight(flight)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBooking && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-medium text-slate-800">Complete Your Booking</h3>
              <button 
                onClick={() => setIsBooking(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Flight</p>
                    <p className="font-medium">{selectedFlight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="font-medium">${selectedFlight.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{selectedFlight.from}</p>
                    <p className="font-medium">{selectedFlight.departureTime}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{selectedFlight.to}</p>
                    <p className="font-medium">{selectedFlight.arrivalTime}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookFlight}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                {bookingComplete ? (
                  'Booked Successfully!'
                ) : (
                  <>
                    <Loader2 className="booking-loader mr-2 h-5 w-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boarding Pass */}
      {showBoardingPass && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-medium text-slate-800">Your Boarding Pass</h3>
              <button 
                onClick={() => setShowBoardingPass(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-xl text-white overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <Plane className="h-24 w-24 text-white/10 transform rotate-45" />
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-blue-200">Passenger</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Flight</p>
                  <p className="font-medium">{selectedFlight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Gate</p>
                  <p className="font-medium">{selectedFlight.gate}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Seat</p>
                  <p className="font-medium">{selectedFlight.seat}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-blue-200">From</p>
                  <p className="text-xl font-medium">{selectedFlight.from}</p>
                  <p className="text-sm text-blue-200">{selectedFlight.departureTime}</p>
                </div>
                <ArrowRight className="h-6 w-6 text-blue-300" />
                <div className="text-right">
                  <p className="text-sm text-blue-200">To</p>
                  <p className="text-xl font-medium">{selectedFlight.to}</p>
                  <p className="text-sm text-blue-200">{selectedFlight.arrivalTime}</p>
                </div>
              </div>
              
              <div className="border-t border-blue-400/30 pt-6">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  {/* Barcode representation */}
                  <div className="flex space-x-1 justify-center">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-white"
                        style={{
                          height: `${Math.random() * 24 + 12}px`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;