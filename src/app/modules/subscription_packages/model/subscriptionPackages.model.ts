import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const packageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'subscription_' + ar7id(),
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: {
      type: String,
      required: true,
      enum: ['weekly', 'monthly', 'yearly'],
    },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export const subscriptionPackageModel = mongoose.model(
  'subscription_packages',
  packageSchema
);
