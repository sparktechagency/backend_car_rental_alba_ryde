import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const collaborationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => ar7id(),
    },
    assetId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    collaboratorId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    permission: {
      type: String,
      enum: ['view_only', 'can_download'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// **Create a unique compound index**
collaborationSchema.index({ assetId: 1, collaboratorId: 1 }, { unique: true });

export const collaborationModelOfMantled = mongoose.model(
  'collaboration',
  collaborationSchema
);
