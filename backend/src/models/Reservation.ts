import mongoose, { Schema, Document } from 'mongoose';
import { ReservationStatus } from '../types';

export interface SelectedAddOn {
  addOnId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
  seats: string[]; // Array of seat IDs
  selectedAddOns: SelectedAddOn[];
  status: ReservationStatus;
  totalAmount: number;
  seatsAmount: number;
  addOnsAmount: number;
  rewardPointsEarned: number;
  createdAt: Date;
  expiresAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
}

const ReservationSchema = new Schema<IReservation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
    index: true
  },
  seats: [{
    type: String,
    required: true
  }],
  selectedAddOns: [{
    addOnId: {
      type: Schema.Types.ObjectId,
      ref: 'AddOn',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING,
    index: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  seatsAmount: {
    type: Number,
    required: true,
    min: 0
  },
  addOnsAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  rewardPointsEarned: {
    type: Number,
    default: 1,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  confirmedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  }
});

// Compound index for efficient queries
ReservationSchema.index({ userId: 1, status: 1 });
ReservationSchema.index({ showtimeId: 1, status: 1 });

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
