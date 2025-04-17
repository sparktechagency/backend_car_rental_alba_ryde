import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'notification_' + ar7id(),
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error', 'for_admin'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    creationTime: {
      type: Number,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const NotificationModel = mongoose.model(
  'Notification_v2',
  notificationSchema
);
