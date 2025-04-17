import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const conversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'conversation_' + ar7id(),
    },
    userId: {
      type: String,
      required: false,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const conversationModel = mongoose.model(
  'conversations_with_property_ai',
  conversationSchema
);
