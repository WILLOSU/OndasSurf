import { Controller, Post, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '.';
import { BeachRepository } from '@src/repositories';
import { Types } from 'mongoose';
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
      const userId = req.context?.userId;
      if (!userId || !Types.ObjectId.isValid(userId)) {
        res
          .status(401)
          .send(ApiError.format({ code: 401, message: 'Unauthorized' }));
        return;
      }
      const result = await this.beachRepository.create({
        ...req.body,
        userId: new Types.ObjectId(userId),
      });
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
