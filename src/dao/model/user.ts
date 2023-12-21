import { Schema, model, Date, Model } from 'mongoose';
import { IRole } from '@src/types/roles';
export interface IUserModel {
  firstName: string;
  lastName: string;
  userId: number;
  role: IRole;
  profileUrl: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string[];
  refreshToken: string[];
}

interface IUserIdSeqModel extends Model<IUserModel> {
  getNextUserId(userId: number, data: any): any;
}

const schema = new Schema<IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      index: true,
    },
    profileUrl: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = model<IUserModel, IUserIdSeqModel>('User', schema);

schema.statics.getNextUserId = async function (userId, data) {
  return this.findOneAndUpdate(
    { userId },
    { $set: { ...data } },
    { upsert: true, new: true },
  ).exec();
};

export default User;
