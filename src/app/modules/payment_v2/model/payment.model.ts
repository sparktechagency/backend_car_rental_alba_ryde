import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'pay_' + ar7id(),
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    paymentMethodId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number, // stored in cents
      required: true,
    },
    amountReceived: {
      type: Number, // stored in cents
      required: false,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      required: true,
      enum: [
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'requires_capture',
        'canceled',
        'succeeded',
      ],
      default: 'requires_payment_method',
    },
    captureMethod: {
      type: String,
      enum: ['automatic', 'manual', 'automatic_async'],
      default: 'automatic',
    },
    confirmationMethod: {
      type: String,
      enum: ['automatic', 'manual'],
      default: 'automatic',
    },
    latestChargeId: {
      type: String,
      required: false,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    receiptEmail: {
      type: String,
      required: false,
    },
    setupFutureUsage: {
      type: String,
      enum: ['off_session', 'on_session', null],
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model('Payment_Stripe', paymentSchema);
