import mongoose from "mongoose";
import { Model } from "mongoose";

export interface ITeacher{
    user: mongoose.Types.ObjectId;
    classes: mongoose.Types.ObjectId[];
    department: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {}