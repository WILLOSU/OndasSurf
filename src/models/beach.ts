import mongoose, { Schema, Types } from 'mongoose';
import { BaseModel } from '.';

export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach extends BaseModel {
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
  userId: string;
}

export interface ExistingBeach extends Beach {
  id: string;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: {
      transform(_, ret) {
        const doc = ret as Omit<typeof ret, '_id' | '__v'> & {
          id?: string;
          _id?: Types.ObjectId;
          __v?: number;
        };
        doc.id = doc._id?.toString();
        delete doc._id;
        delete doc.__v;
      },
    },
  }
);

export const Beach = mongoose.model<Beach>('Beach', schema);
