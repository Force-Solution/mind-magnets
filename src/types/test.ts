import mongoose, { Model } from 'mongoose';

export interface ITest {
  name: string;
  batch: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  maximumMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestDoc extends ITest, Document {}
export interface ITestModel extends Model<ITestDoc> {}
