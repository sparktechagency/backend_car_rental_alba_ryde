import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';
import { createPrivacyTermsIfNotCreatedFunction } from '../controller/privacyTerms.controller';

const privacyTermsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'privacy_terms_' + ar7id(),
    },

    privacy_terms: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This enables the automatic creation of `createdAt` and `updatedAt`
);

export const privacyTermsModel = mongoose.model(
  'privacy_terms',
  privacyTermsSchema
);
createPrivacyTermsIfNotCreatedFunction();
