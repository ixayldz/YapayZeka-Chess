import mongoose, { Schema } from 'mongoose';
import { IBot } from '../types';

const BotSchema = new Schema({
  name: { type: String, required: true },
  apiConfig: {
    apiKey: { type: String, required: true },
    modelType: { type: String, required: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<IBot>('Bot', BotSchema); 