import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const tripPriceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'trip_price_' + ar7id(),
    },
    price: {
      type: Number,
      required: true,
    },
    carType: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], required: true },
    },
    dropoffLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const TripPriceModel = mongoose.model('trip_prices', tripPriceSchema);
