import mongoose, { Document } from 'mongoose';
import AuthService from '@src/services/auth';
import logger from '@src/logger';
import { BaseModel } from '.';

export interface User extends BaseModel {
  name: string;
  email: string;
  password: string;
}

export interface ExistingUser extends User {
  id: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_: unknown, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    logger.error({ err }, `Error hashing the password for the user ${this.name}`);
  }
});

export const User = mongoose.model<UserModel>('User', schema);