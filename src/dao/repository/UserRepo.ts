import { BadRequestError, message } from '@src/core/API_Handler/ApiError';
import User from '@src/dao/model/user';
import { IUser, IUserDoc } from '@src/types/user';

export class UserRepo {
  public async createUser(userBody: IUser): Promise<IUserDoc> {
    if (await this.getUserByEmail(userBody.email)) {
      throw new BadRequestError(message.DuplicateEmail);
    }
    return User.create(userBody);
  }

  public getUserByEmail(email: string): Promise<IUserDoc | null> {
    return  User.findOne({ email });
  }

  public  countUserByRole(role: string): Promise<number> {
    return  User.countDocuments({ role });
  }
}
