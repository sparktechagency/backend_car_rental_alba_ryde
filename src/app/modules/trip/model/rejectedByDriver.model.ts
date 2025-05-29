import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const rejectedByDriverSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'rejected_by_driver_' + ar7id(),
    },
    driverId: {
      type: String,
      required: true,
    },
    tripId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RejectedByDriverModel = mongoose.model(
  'rejectedByDriver',
  rejectedByDriverSchema
);
