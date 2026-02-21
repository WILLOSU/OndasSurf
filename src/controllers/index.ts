import { Response } from 'express';
import ApiError, { APIError } from '@src/util/errors/api-error';
import {
  DatabaseConflictError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
} from '@src/repositories/repository';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
    if (error instanceof DatabaseConflictError) {
      res.status(409).send(ApiError.format({ code: 409, message: error.message }));
    } else if (error instanceof DatabaseUnknownClientError || error instanceof DatabaseValidationError) {
      res.status(400).send(ApiError.format({ code: 400, message: error.message }));
    } else {
      res.status(500).send(ApiError.format({ code: 500, message: 'Something went wrong!' }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}