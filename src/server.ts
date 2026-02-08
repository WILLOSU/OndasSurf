import './util/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import pinoHttp from 'pino-http';
import cors from 'cors';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from './database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port: string | number = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(pinoHttp({ logger }));
    this.app.use(cors({
      origin: '*'
    }));
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    try {
      await database.connect();
      logger.info('MongoDB conectado com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar no MongoDB:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
