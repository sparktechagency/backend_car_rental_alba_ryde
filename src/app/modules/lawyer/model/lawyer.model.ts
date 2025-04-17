import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';
const AssetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'lawyer_' + ar7id(),
    },
    name: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const lawyerModelOfMantled = mongoose.model(
  'lawyer_of_mantled',
  AssetSchema
);
