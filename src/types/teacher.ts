import mongoose from "mongoose";
import { Model } from "mongoose";

export interface ITeacher{
    user: mongoose.Types.ObjectId;
    department: string;
    post: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {}