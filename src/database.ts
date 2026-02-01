import config from 'config';
import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> => {
  // Tenta pegar do config primeiro, depois do process.env como fallback
  let mongoUrl: string;
  
  try {
    mongoUrl = config.get<string>('App.database.mongoUrl');
  } catch (error) {
    // Se config falhar, usa diretamente a variável de ambiente
    mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/surf-forecast';
  }
  
  // Se ainda estiver apontando para localhost em produção, força o env
  if (process.env.NODE_ENV === 'production' && mongoUrl.includes('localhost')) {
    mongoUrl = process.env.MONGODB_URL || mongoUrl;
  }
  
  console.log('Tentando conectar ao MongoDB...');
  console.log('URL (primeiros 20 chars):', mongoUrl.substring(0, 20));
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  return await mongoose.connect(mongoUrl);
};

export const close = (): Promise<void> => mongoose.connection.close();