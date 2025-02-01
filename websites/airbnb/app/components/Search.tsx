import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchProps {
  onSearch: (searchParams: SearchParams) => void;
}

interface SearchParams {
  place: string;
  checkIn: string;
  checkOut: string;
  occupants: number;
}

export default function Search({ onSearch }: SearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    place: '',
    checkIn: '',
    checkOut: '',
    occupants: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mb-8 p-4 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Where are you going?"
          value={searchParams.place}
          onChange={(e) => setSearchParams({ ...searchParams, place: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={searchParams.checkIn}
          onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={searchParams.checkOut}
          onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={searchParams.occupants}
            onChange={(e) => setSearchParams({ ...searchParams, occupants: parseInt(e.target.value) })}
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
} 