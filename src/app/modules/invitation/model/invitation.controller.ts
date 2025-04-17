import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const invitationSchema = new mongoose.Schema(
  {
    id: {
      type: 'String',
      required: true,
      unique: true,
      default: () => ar7id(),
    },
    assetId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    inviterId: {
      type: String,
    },
    inviteeId: {
      type: String,
    },
    permission: {
      type: String,
      required: true,
      enum: ['view_only', 'can_download'],
      default: 'view_only',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending',
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const invitationModelOfMantled = mongoose.model(
  'Invitation',
  invitationSchema
);
