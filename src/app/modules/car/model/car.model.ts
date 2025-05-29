import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const carSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'car_' + ar7id(),
    },
    ownerId: {
      type: String,
      required: true,
    },
    carBrand: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    yearOfManufacture: {
      type: Number,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    carType: {
      type: String,
      required: true,
      enum: [
        'sedan',
        'suv',
        'truck',
        'hatchback',
        'coupe',
        'convertible',
        'minivan',
        'wagon',
      ],
    },
    proposedPricePerHourByDriver: {
      type: Number,
      required: false,
    },
    approvedPricePerHour: {
      type: Number,
      required: false,
    },
    proposedPricePerKilometer: {
      type: Number,
      required: false,
    },
    approvedPricePerKilometer: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CarModel = mongoose.model('Car', carSchema);
