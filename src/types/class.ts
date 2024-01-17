import mongoose, { Document, Model } from "mongoose";

export interface IClass{
    name: string;
    students: mongoose.Types.ObjectId[],
    teacher: mongoose.Types.ObjectId,
    batch: mongoose.Types.ObjectId,
    startTime:Date,
    endTime: Date, 
    createdAt: Date,
    updatedAt: Date,
}
export interface IClassDoc extends IClass, Document {}
export interface IClassModel extends Model<IClassDoc> {}