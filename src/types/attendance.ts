import mongoose, { Model } from 'mongoose';

export interface IAttendance {
  batch: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId[]; // present students
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendanceDoc extends IAttendance, Document {}
export interface IAttendanceModel extends Model<IAttendanceDoc> {}
