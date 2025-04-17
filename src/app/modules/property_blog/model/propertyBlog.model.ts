import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const propertySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'property_blog_' + ar7id(),
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true } // This enables the automatic creation of `createdAt` and `updatedAt`
);

export const propertyBlogModel = mongoose.model(
  'property_blog',
  propertySchema
);
