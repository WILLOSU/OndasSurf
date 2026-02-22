import mongoose from 'mongoose';
import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { User } from '@src/models/user';
import { UserRepository, WithId } from '.';

export class UserMongoDBRepository
  extends DefaultMongoDBRepository<User>
  implements UserRepository
{
  constructor(userModel = User) {
    super(userModel);
  }

  async findOneById(id: string): Promise<WithId<User> | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return undefined;
    }
    return this.findOne({ _id: id });
  }

  async findOneByEmail(email: string): Promise<WithId<User> | undefined> {
    return this.findOne({ email });
  }
}
