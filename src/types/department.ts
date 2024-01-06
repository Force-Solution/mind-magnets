import mongoose, { Model, Document } from "mongoose";

export interface IDepartment{
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDepartmentDoc extends IDepartment, Document {
    _id: mongoose.Types.ObjectId;
}
export interface IDepartmentModel extends Model<IDepartmentDoc> {
    isDepartmentPresent(
        name: string,
        excludeDepartmentId?: mongoose.Types.ObjectId,
      ): Promise<boolean>;
}