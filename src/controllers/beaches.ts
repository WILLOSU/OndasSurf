import { Controller, Post, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '.';
import { BeachRepository } from '@src/repositories';
import ApiError from '@src/util/errors/api-error';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  constructor(private beachRepository: BeachRepository) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.beachRepository.create({
        ...req.body,
        ...{ userId: req.context?.userId },
      });
      res.status(201).send(result);
    } catch (error) {
      if (
        error instanceof mongoose.Error.ValidationError ||
        error instanceof Error
      ) {
        this.sendCreateUpdateErrorResponse(res, error);
      } else {
        res
          .status(500)
          .send(ApiError.format({ code: 500, message: 'Something went wrong!' }));
      }
    }
  }
}