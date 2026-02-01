import config from 'config';
import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> => {
  const mongoUrl = config.get<string>('App.database.mongoUrl');
  console.log('Tentando conectar ao MongoDB...'); // Log para debug
  console.log('URL (primeiros 20 chars):', mongoUrl.substring(0, 20)); // Não mostra senha completa
  return await mongoose.connect(mongoUrl);
};

export const close = (): Promise<void> => mongoose.connection.close();
