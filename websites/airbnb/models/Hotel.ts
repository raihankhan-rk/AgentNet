import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: String,
  userId: String,
  checkIn: String,
  checkOut: String,
  guests: Number,
  totalPrice: Number
});

const hotelSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  location: String,
  availableDates: [String],
  bookings: [bookingSchema]
});

export const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema); 