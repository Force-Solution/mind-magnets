import mongoose, { Document, Model } from 'mongoose';

export interface IClass {
  name: string;
  description: string;
  backgroundImg: string;
  logoImg: string;
  students: mongoose.Types.ObjectId[];
  teacher: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface IClassDoc extends IClass, Document {
  _id: mongoose.Types.ObjectId;
}
export interface IClassModel extends Model<IClassDoc> {
  isClassPresent(
    name: string,
    excludeDepartmentId?: mongoose.Types.ObjectId,
  ): Promise<boolean>;
}
