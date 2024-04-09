import mongoose, { Model } from 'mongoose';

export type Status = 'draft' | 'publish'

export interface ITest {
  name: string;
  batch: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  type: Status;
  startTime: Date;
  endTime: Date;
  teacher: mongoose.Types.ObjectId;
  maximumMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestDoc extends ITest, Document {}
export interface ITestModel extends Model<ITestDoc> {}
