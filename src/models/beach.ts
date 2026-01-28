import mongoose, { Document, Model, Schema } from 'mongoose';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

interface BeachModel extends Omit<Beach, '_id'>, Document {}

const schema = new mongoose.Schema<BeachModel>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    } as unknown as string, 
  },
  {
    toJSON: {
      transform: (_, ret: Record<string, unknown>): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Beach: Model<BeachModel> = mongoose.model<BeachModel>('Beach', schema);