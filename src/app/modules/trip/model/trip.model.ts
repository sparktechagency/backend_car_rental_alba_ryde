import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const tripSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'trip_' + ar7id(),
    },
    customerId: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'cancelled'],
      default: 'pending',
    },
    pickoffLocationName: {
      type: String,
      required: true,
    },
    pickoffLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], required: true },
    },
    dropoffLocationName: {
      type: String,
      required: true,
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

// Create a 2dsphere index on the pickoff and dropoff location fields for geospatial queries
tripSchema.index({ pickoffLocation: '2dsphere' });
tripSchema.index({ dropoffLocation: '2dsphere' });

export const TripModel = mongoose.model('Trip', tripSchema);
