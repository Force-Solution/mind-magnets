import { IDepartmentDoc, IDepartmentModel } from '@src/types/department';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<IDepartmentDoc, IDepartmentModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
);

schema.statics.isDepartmentPresent = async function (
  name: string,
  excludeDepartmentId: mongoose.ObjectId,
) {
  return !!(await this.findOne({ name, _id: { $ne: excludeDepartmentId } }));
};

const Department = model<IDepartmentDoc, IDepartmentModel>(
  'Department',
  schema,
);

export default Department;
