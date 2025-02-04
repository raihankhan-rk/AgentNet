import dbConnect from '../lib/mongodb';
import { Hotel } from '../models/Hotel';
import hotelsData from '../data/hotels.json';

async function seedDatabase() {
  try {
    await dbConnect();
    
    // Clear existing data
    await Hotel.deleteMany({});
    
    // Insert new data
    await Hotel.insertMany(hotelsData.hotels);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 