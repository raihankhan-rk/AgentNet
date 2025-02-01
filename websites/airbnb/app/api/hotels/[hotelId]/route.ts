import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'hotels.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const hotel = data.hotels.find((h: any) => h.id === params.hotelId);
    
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
} 