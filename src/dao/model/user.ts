import mongoose, { Schema, model, Date, Model } from 'mongoose';
import bcrypt from 'bcrypt';

import { saltHashRounds } from '@src/config/configManager';

export const enum IRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
  Parent = 'parent',
}

export interface IUser{
  firstName: string;
  lastName: string;
  userId: number;
  role: IRole;
  profileUrl: string;
  email: string;
  isEmailVerified:boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string[];
  refreshToken: string[];
}
interface IUserDoc extends IUser, Document{
  isPasswordMatch(password:string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDoc> {
  getNextUserId(userId: number, data: any): any;
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

const validateEmail = (email: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);

const schema = new Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Number,
      index: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      index: true,
      enum: [IRole.Admin, IRole.Teacher, IRole.Student, IRole.Parent]
    },
    profileUrl: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      validate:{
        validator: (value:string) => validateEmail(value),
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    isEmailVerified:{
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

schema.statics.getNextUserId = async function (userId, data) {
  return this.findOneAndUpdate(
    { userId },
    { $set: { ...data }, $setOnInsert: { userId }},
    { upsert: true, new: true },
  ).exec();
};

schema.statics.isEmailTaken = async function (email: string, excludeUserId: mongoose.ObjectId) {
  return !!await this.findOne({ email, _id: { $ne: excludeUserId } });
}

schema.methods.isPasswordMatch = async function(password:string){
  return bcrypt.compare(password, this.password);
};

schema.pre('save', async function(next){
  if(this.isModified('password')){
    const saltRounds:number = parseInt(saltHashRounds || '8');
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const User = model<IUserDoc, IUserModel>('User', schema);

export default User;
