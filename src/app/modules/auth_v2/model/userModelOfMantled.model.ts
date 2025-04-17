import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => ar7id() },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  role: {
    type: String,
    enum: ['user', 'collaborator', 'admin'],
    default: 'user',
    required: true,
  },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  address: { type: String, required: false },
  occupation: { type: String, required: false },
  maritalStatus: {
    type: String,
    enum: [
      'single',
      'married',
      'divorced',
      'widowed',
      'separated',
      'engaged',
      'in a relationship',
      'domestic partnership',
      'civil union',
    ],
    required: false,
  },
  passportImageUrl: { type: String, default: '' },
  idCardImageUrl: { type: String, default: '' },
  drivingLicenseImageUrl: { type: String, default: '' },
  profileImageUrl: { type: String, default: '' },
  vaultPasswordHash: { type: String, required: false },
  fingerprintTemplate: { type: Buffer, required: false },
  isBanned: { type: Boolean, default: false },
  isSubscribed: {
    type: Boolean,
    defaultL: false,
  },
  authCardImageSrc: { type: String, required: false },
  authCardImageApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const userModelOfMantled = mongoose.model('userssss_old', userSchema);
