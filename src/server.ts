// server o arquivo principal

import './util/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';

export class SetupServer extends Server {
  // server basicamente serve um express através da classe server

  constructor(private port = 3000) {
    // private dentro do construtor na cria dentro da classe
    // vai ter um this.port, cria na estancia da classe
    super(); // estendendo a classe server
  }

  public init(): void {
    // inicia o servidor
    this.setupExpress(); // CHAMANDO O SETUP EXPRESS
    this.setupControllers(); // CHAMANDO O SETUP CONTROLLERS
  }

  // método para fazer setup do express

  private setupExpress(): void {
    this.app.use(bodyParser.json()); // passando para o app um middleware , body parser
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]); // PASSA A LISTA FORECAST CONTROLLER
  }

  public getApp(): Application {
    return this.app;
  }
}

/* TEMOS AQUI

uma classe setup server, ela tem um construtor, quando alguém der um NEW SetupServe nela
vai poder passar um porta para ela, a porta vai ser usada pelo express, 
temos o MÉTODO init que é publico, esperamos que alguém chame este método.

Temos o MÉTODO setupExpress, que é privado, o MÉTODO INIT chama este MÉTODO setupExpress.

Estamos separando a inicialização da aplicação, quem inicia o server tenha o controle.

primeiro constroí o constrole server passando por uma porta depois chama o init

o init não pode ser chamado no construtor?, por que vamos iniciar o banco de dados, e este

tipo de coisa são assincrona, enão dá para ter um construtor assíncrona, não dá para fazer

um promesse no contrutor.


*/
