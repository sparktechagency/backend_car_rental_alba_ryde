import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'payment_' + ar7id(),
    },
    userId: { type: String, required: true },
    packageId: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: false },
    cardBrand: { type: String },
    last4: { type: String },
    receiptUrl: { type: String, required: false },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model(
  'Payment_model_of_mantled',
  paymentSchema
);
