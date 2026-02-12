import mongoose, { Schema, Document } from 'mongoose';

export interface IAddOn extends Document {
  name: string;
  description: string;
  price: number;
  category: 'food' | 'beverage' | 'accessory' | 'upgrade';
  image: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddOnSchema = new Schema<IAddOn>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ['food', 'beverage', 'accessory', 'upgrade']
    },
    image: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAddOn>('AddOn', AddOnSchema);
