import './util/module-alias';
import { SetupServer } from './server';
import config from 'config';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

// esqutando promisse com rejeição, e joga um exceção
process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );
  throw reason;
});

// quando houver uma exceção
process.on('uncaughtException', (error) => {
  console.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(process.env.PORT || config.get('App.port'));
    await server.init();
    server.start();
    
    // passa o sinal por um processo desligar
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.forEach((sig) =>
      process.on(sig, async () => {
        try {
          await server.close();
          console.info(`App exited with success`);
          process.exit(ExitStatus.Success);
        } catch (error) {
          console.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      })
    );
  } catch (error) {
    console.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();