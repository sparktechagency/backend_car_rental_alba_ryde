import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const chatHistorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'chat_' + ar7id(),
    },
    conversationId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ['user', 'ai', 'zoopla'],
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

chatHistorySchema.index({ conversationId: 1 });

export const chatHistoryModel = mongoose.model(
  'chat_history_with_property_ai',
  chatHistorySchema
);
