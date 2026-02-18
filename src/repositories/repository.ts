import { BaseRepository, FilterOptions, WithId } from '.';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class Repository<T> implements BaseRepository<T> {
  public abstract create(data: T): Promise<WithId<T>>;

  // criamos a interface em index, e agora criamos agora implementação da interface, 
  // ou seja, a classe abstrata Repository, que implementa a interface BaseRepository, 
  // e define os métodos abstratos create, findOne, find e deleteAll.

  public abstract findOne(
    options: FilterOptions
  ): Promise<WithId<T> | undefined>;

  public abstract find(filter: FilterOptions): Promise<WithId<T>[]>;

  public abstract deleteAll(): Promise<void>;
}
