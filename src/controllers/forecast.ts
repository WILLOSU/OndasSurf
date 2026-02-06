import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/services/forecast';
import { Beach } from '@src/models/beach';
import { StormGlass } from '@src/clients/stormGlass';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';

const stormGlass = new StormGlass();
const forecast = new Forecast(stormGlass);

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({user: req.decoded?.id});
      const forecastData = await forecast.processForecastForBeaches(beaches as unknown as Beach[]);
      res.status(200).send(forecastData);
    } catch (error){
      logger.error({ error }, 'Forecast error');
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}