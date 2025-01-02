import { Document } from 'mongoose';

export interface IMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface IBot extends Document {
  name: string;
  apiConfig: {
    modelType: string;
    apiKey: string;
  };
}

export interface IGame extends Document {
  botA: IBot['_id'];
  botB: IBot['_id'];
  moves: string[];
  status: 'pending' | 'active' | 'completed';
  winner?: IBot['_id'];
  createdAt: Date;
  updatedAt: Date;
} 