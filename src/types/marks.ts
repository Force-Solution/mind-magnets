import mongoose, { Model } from 'mongoose';

export interface IMarks {
  student: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  marksObtained: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMarksDoc extends IMarks, Document {}
export interface IMarksModel extends Model<IMarksDoc> {}
