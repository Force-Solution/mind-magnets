import mongoose from "mongoose";
import {Document, Model } from "mongoose";

interface IAddress{
    location: string;
    state: string;
    zipCode: number;
}

export interface IStudent{
    user: mongoose.Types.ObjectId;
    batch: mongoose.Types.ObjectId;
    payment: mongoose.Types.ObjectId;
    classes: [mongoose.Types.ObjectId];
    dateOfJoin: Date;
    address: IAddress;
    parentName: string;
    parentEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStudentDoc extends IStudent, Document {
    _id: mongoose.Types.ObjectId;
}
export interface IStudentModel extends Model<IStudentDoc> {}