import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';
const AssetSchema = new mongoose.Schema(
  {
    id: {
      type: 'String',
      required: true,
      unique: true,
      default: () => ar7id(),
    },
    ownerId: {
      type: mongoose.Schema.Types.Mixed,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'financial asset',
        'debts & liabilities',
        'personal docs',
        'memoirs/others',
        'real estate',
        'tangible asset',
      ],
    },
    assetName: {
      type: String,
      required: true,
    },
    assetDetails: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
    },
    accountName: {
      type: String,
    },
    assetCountry: {
      type: String,
    },
    assetState: {
      type: String,
    },
    assetAddress: {
      type: String,
    },
    assetDocumentUrl: {
      type: String,
    },
    collaboratorEmail: {
      type: String,
    },
    beneficiaryName: {
      type: String,
    },
    beneficiaryDateOfBirth: {
      type: Date,
    },
    relationWithBeneficiary: {
      type: String,
    },
    beneficiaryDocumentUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const assetModel = mongoose.model('Asset', AssetSchema);
