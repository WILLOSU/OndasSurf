import { SetupServer } from './server';
import config from 'config';

async function bootstrap() {
  // config.get('App.port') lerá a variável PORT do Render graças ao Passo 3
  const server = new SetupServer(config.get('App.port')); 
  await server.init();
  server.start();
}

bootstrap();
