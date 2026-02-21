import logger from '@src/logger';
import { BaseModel } from '@src/models';
import { CUSTOM_VALIDATION } from '@src/models/user';
import mongoose, { Model } from 'mongoose';
import { FilterOptions, WithId } from '.';
import {
  DatabaseConflictError,
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
  Repository,
} from './repository';

export abstract class DefaultMongoDBRepository<
  T extends BaseModel,
> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }

  async create(data: T): Promise<WithId<T>> {
    try {
      const model = new this.model(data);
      const createdData = await model.save();
      return createdData.toJSON<WithId<T>>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(options: FilterOptions): Promise<WithId<T> | undefined> {
    try {
      const data = await this.model.findOne(options);
      return data?.toJSON<WithId<T>>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async find(filter: FilterOptions): Promise<WithId<T>[]> {
    try {
      const data = await this.model.find(filter);
      return data.map((d) => d.toJSON<WithId<T>>());
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }

  protected handleError(error: unknown): never {
    if (error instanceof mongoose.Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) =>
          err.name === 'ValidatorError' &&
          err.kind === CUSTOM_VALIDATION.DUPLICATED
      );
      if (duplicatedKindErrors.length) {
        throw new DatabaseConflictError(error.message);
      }
      throw new DatabaseValidationError(error.message);
    }
    if (error instanceof mongoose.Error.CastError) {
      throw new DatabaseValidationError(
        `Invalid value for field ${error.path}: ${error.value}`
      );
    }
    if (error instanceof DatabaseUnknownClientError) {
      throw error;
    }
    logger.warn({ error }, 'Database error');
    throw new DatabaseInternalError(
      'Something unexpected happened to the database'
    );
  }
}
