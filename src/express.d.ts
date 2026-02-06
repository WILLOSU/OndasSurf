import { DecodedUser } from '@src/services/auth';

declare global {
  namespace Express {
    interface Request {
      decoded?: DecodedUser;
    }
  }
}

export {};