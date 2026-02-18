import bcrypt from 'bcrypt';
import config from 'config';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtToken {
  sub: string;
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

  public static generateToken(sub: string): string {
    const secret = config.get<string>('App.auth.key');
    const expiresIn = config.get<SignOptions['expiresIn']>('App.auth.tokenExpiresIn');

    return jwt.sign({ sub }, secret, { expiresIn });
  }

  public static decodeToken(token: string): JwtToken {
    const secret = config.get<string>('App.auth.key');
    return jwt.verify(token, secret) as JwtToken;
  }
}