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
      required: false,
    },
    status: {
      type: String,
      required: false,
      enum: [
        'not_accepted',
        'pending',
        'accepted',
        'ongoing',
        'completed',
        'cancelled',
      ],
    },
    type: {
      type: String,
      required: true,
      enum: ['user_search', 'user_request', 'current', 'booked'],
    },
    pickupLocationName: {
      type: String,
      required: false,
    },
    pickupLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], required: true },
    },
    dropoffLocationName: {
      type: String,
      required: false,
    },
    dropoffLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], required: true },
    },
    price: {
      type: Number,
      required: true,
    },
    carType: {
      type: String,
      required: true,
    },
    pickupTime: {
      type: Date,
      required: false,
    },
    dropoffTime: {
      type: Date,
      required: false,
    },
    estimatedTimeInSeconds: {
      type: Number,
      required: false,
    },
    distanceInKilometers: {
      type: Number,
      required: false,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['not_paid', 'paid'],
      default: 'not_paid',
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the pickoff and dropoff location fields for geospatial queries
tripSchema.index({ pickupLocation: '2dsphere' });
tripSchema.index({ dropoffLocation: '2dsphere' });

export const TripModel = mongoose.model('Trip', tripSchema);
