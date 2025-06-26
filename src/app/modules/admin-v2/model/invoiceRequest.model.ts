import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const tempSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'temp_' + ar7id(),
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TempModel = mongoose.model('temp_datas', tempSchema);
