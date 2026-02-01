import './util/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from './database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';

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
      console.log('MongoDB conectado com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar no MongoDB:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    const portToListen = Number(this.port);
    this.app.listen(portToListen, '0.0.0.0', () => {
      console.log(`Servidor rodando com sucesso na porta: ${portToListen}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}