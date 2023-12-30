import mongoose from "mongoose";
import { Model } from "mongoose";

export interface IBatch{
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBatchDoc extends IBatch, Document {
    _id: mongoose.Types.ObjectId;
}
export interface IBatchModel extends Model<IBatchDoc> {}