import User, { IUser } from '@src/dao/model/User';

export class UserRepo {
  public async createUser(userBody: IUser) {
    if (await this.getUserByEmail(userBody.email)) {
        // throw  Api.invalid()
    }
    return User.create(userBody);
  };
  
  public async getUserByEmail(email: string) {
    return User.findOne({ email });
  }
}
