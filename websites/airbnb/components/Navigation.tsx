"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 py-4">
          <Link 
            href="/"
            className={`${pathname === '/' ? 'text-blue-500 font-bold' : 'text-gray-600'} hover:text-blue-500`}
          >
            Search Hotels
          </Link>
          <Link 
            href="/bookings"
            className={`${pathname === '/bookings' ? 'text-blue-500 font-bold' : 'text-gray-600'} hover:text-blue-500`}
          >
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
} 