import config from 'config';
import mongoose, { Mongoose } from 'mongoose';
import logger from '@src/logger';

export const connect = async (): Promise<Mongoose> => {
  let mongoUrl: string;

  try {
    mongoUrl = config.get<string>('App.database.mongoUrl');
  } catch {
    mongoUrl =
      process.env.MONGODB_URL || 'mongodb://localhost:27017/surf-forecast';
  }

  if (process.env.NODE_ENV === 'production' && mongoUrl.includes('localhost')) {
    mongoUrl = process.env.MONGODB_URL || mongoUrl;
  }

  logger.info('Tentando conectar ao MongoDB...');
  logger.info({ url: mongoUrl.substring(0, 20) }, 'URL (primeiros 20 chars)');
  logger.info({ nodeEnv: process.env.NODE_ENV }, 'NODE_ENV');

  return await mongoose.connect(mongoUrl);
};

export const close = (): Promise<void> => mongoose.connection.close();
