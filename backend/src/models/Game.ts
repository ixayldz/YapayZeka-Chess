import mongoose, { Schema, Document } from 'mongoose';
import { IGame } from '../types';

const GameSchema = new Schema({
  botA: {
    type: Schema.Types.ObjectId,
    ref: 'Bot',
    required: true
  },
  botB: {
    type: Schema.Types.ObjectId,
    ref: 'Bot',
    required: true
  },
  moves: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'Bot'
  }
}, {
  timestamps: true
});

export default mongoose.model<IGame>('Game', GameSchema); 