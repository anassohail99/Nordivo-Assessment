import mongoose, { Schema, Document } from 'mongoose';
import { Seat } from '../types';

export interface IShowtime extends Document {
  movieId: mongoose.Types.ObjectId;
  theaterHall: string;
  startTime: Date;
  endTime: Date;
  seats: Seat[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[]; // Array of seat IDs
  price: {
    standard: number;
    premium: number;
    vip: number;
  };
  createdAt: Date;
}

const SeatSchema = new Schema({
  id: { type: String, required: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'standard'
  },
  price: { type: Number, required: true }
}, { _id: false });

const ShowtimeSchema = new Schema<IShowtime>({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  theaterHall: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true
  },
  seats: [SeatSchema],
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  bookedSeats: [{
    type: String
  }],
  price: {
    standard: { type: Number, default: 10 },
    premium: { type: Number, default: 15 },
    vip: { type: Number, default: 20 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
ShowtimeSchema.index({ movieId: 1, startTime: 1 });

export default mongoose.model<IShowtime>('Showtime', ShowtimeSchema);
