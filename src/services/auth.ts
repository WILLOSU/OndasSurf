import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '@src/models/users';

export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: Record<string, unknown>): string {
    const secret = config.get<string>('App.auth.key');
    const expiresIn = config.get<string | number>('App.auth.tokenExpiresIn');

    const safePayload = {
      ...payload,
      ...('_id' in payload && { _id: String(payload._id) }),
    };

    return jwt.sign(safePayload, secret, {
      expiresIn: expiresIn,
    } as jwt.SignOptions);
  }

  public static decodeToken(token: string): DecodedUser {
    const secret = config.get<string>('App.auth.key');
    return jwt.verify(token, secret) as DecodedUser;
  }
}