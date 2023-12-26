import { Model } from "mongoose";

export interface ITeacher{
    user: string;
    department: string;
    post: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {}

export const enum Department{
    Physics = "physics",
    Chemistry = "chemistry",
    Mathematics = "mathematics",
    Biology = "biology",
}

export const enum Post{
    Professor = "professor",
    AssitantProfessor = "assitantProfessor"
}