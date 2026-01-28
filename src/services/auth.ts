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

  public static generateToken(payload: object): string {
    const secret = config.get<string>('App.auth.key');
    const expiresIn = config.get<string | number>('App.auth.tokenExpiresIn');

    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    } as jwt.SignOptions);
  }

  public static decodeToken(token: string): object {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedUser;
    
  }

}
