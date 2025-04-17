import mongoose from 'mongoose';
import { ar7id } from '../../../../helpers/ar7Id';

const faqSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => 'faq_' + ar7id(),
  },
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answer: { type: String, required: true },
});

export const faqModel = mongoose.model('faq', faqSchema);
