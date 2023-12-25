import { Model } from "mongoose";

interface IAddress{
    location: string;
    state: string;
    zipCode: number;
}

export interface IStudent{
    user: string;
    batch: string;
    dateOfJoin: Date;
    address: IAddress;
    parentName: string;
    parentEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStudentDoc extends IStudent, Document {}
export interface IStudentModel extends Model<IStudentDoc> {}