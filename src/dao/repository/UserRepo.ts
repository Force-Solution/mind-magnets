import { BadRequestError, message } from '@src/core/API_Handler/ApiError';
import User from '@src/dao/model/user';
import { IUser } from '@src/types/user';

export class UserRepo {
  public async createUser(userBody: IUser) {
    if (await this.getUserByEmail(userBody.email)) {
        throw new BadRequestError(message.DuplicateEmail);
    }
    return User.create(userBody);
  };
  
  public async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }
}
