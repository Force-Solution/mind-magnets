import { BadRequestError, message } from '@src/core/API_Handler/ApiError';
import User from '@src/dao/model/user';
import { IUser, IUserDoc } from '@src/types/user';

export class UserRepo {
  user: typeof User;
  constructor(){
    this.user = User;
  }
  public async createUser(userBody: IUser): Promise<IUserDoc> {
    if (await this.getUserByEmail(userBody.email)) {
      throw new BadRequestError(message.DuplicateEmail);
    }
    return this.user.create(userBody);
  }

  public getUserByEmail(email: string): Promise<IUserDoc | null> {
    return  this.user.findOne({ email });
  }

  public  countUserByRole(role: string): Promise<number> {
    return  this.user.countDocuments({ role });
  }

  public async updateUserPassword(userBody: IUser): Promise<IUserDoc | null>{
    const existingUserDoc = await this.user.findOne({userId: userBody.userId});

    if(!existingUserDoc) throw new BadRequestError("User Id is not correct");

    existingUserDoc.password = userBody.password;
    existingUserDoc.isEmailVerified = true;

    await existingUserDoc.save();

    return existingUserDoc;

  }

  public getUserById(_id: string): Promise<IUserDoc | null>{
    return this.user.findOne({_id});
  }

  public getUserByUserId(id: string | number): Promise<IUserDoc | null>{
    return this.user.findOne({userId: id});
  }
}
