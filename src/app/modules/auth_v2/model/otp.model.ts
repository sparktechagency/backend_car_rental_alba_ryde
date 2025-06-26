import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Add a TTL index on the createdAt field, with an expiration time of 5 minutes (300 seconds)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const otpModel = mongoose.model('otp_data', otpSchema);
