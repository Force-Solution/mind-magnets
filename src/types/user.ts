import mongoose, { Date, Model } from 'mongoose';
import { IRole } from '@src/types/roles';

export interface IUser {
  firstName: string;
  lastName: string;
  userId: number;
  userName: string;
  role: IRole;
  profileUrl: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string[];
  refreshToken: string[];
}
export interface IUserDoc extends IUser, Document {
  _id: mongoose.Types.ObjectId;
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId,
  ): Promise<boolean>;
}
