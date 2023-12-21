import { BadRequestError, message } from '@src/core/API_Handler/ApiError';
import User, { IUser } from '@src/dao/model/user';

export class UserRepo {
  public async createUser(userBody: IUser) {
    if (await this.getUserByEmail(userBody.email)) {
        throw new BadRequestError(message.DuplicateEmail);
    }
    return User.create(userBody);
  };
  
  public async getUserByEmail(email: string) {
    return User.findOne({ email });
  }
}
