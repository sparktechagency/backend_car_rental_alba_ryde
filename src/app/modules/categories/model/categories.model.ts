import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const categoriesSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: () => ar7id() },
    name: { type: String, unique: true, required: true },
    imageUrl: { type: String, required: false, default: '' },
  },
  { timestamps: true }
);

export const categoriesModel = mongoose.model(
  'categories_data',
  categoriesSchema
);
