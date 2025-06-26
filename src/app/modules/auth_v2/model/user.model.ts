import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'user_' + ar7id(),
    },
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: false,
    },
    passwordHash: { type: String, required: false },
    role: {
      type: String,
      enum: ['user', 'driver', 'admin'],
      required: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
      required: true,
    },
    profilePictureUrl: {
      type: String,
      required: false,
    },
    stripeCustomerId: {
      type: String,
      required: false,
    },
    stripePaymentMethodId: {
      type: String,
      required: false,
    },
    nameOfTheBank: {
      type: String,
      required: false,
    },
    accountNumberOfTheBank: {
      type: String,
      required: false,
    },
    branchCodeOfBank: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model('users', userSchema);
