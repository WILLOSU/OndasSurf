import './util/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from './database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users'; 

export class SetupServer extends Server {
  constructor(private port = 3000) {
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
    this.addControllers([forecastController, beachesController, usersController]); 
  }

 private async databaseSetup(): Promise<void> { 
  //console.log('--- Tentando conectar ao MongoDB... ---');
  try {
    await database.connect();
    //console.log('');
  } catch (error) {
    console.error('', error);
    throw error; // Repassa o erro para o Jest mostrar o motivo real
  }
}

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      //console.log(``);
    });
  }
  
  public getApp(): Application {
    return this.app;
  }
}
