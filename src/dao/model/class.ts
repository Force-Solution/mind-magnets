import { IClassDoc, IClassModel } from '@src/types/class';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<IClassDoc, IClassModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    batch:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    description: String,
    backgroundImg: String,
    logoImg: String,
    startTime: Date,
    endTime: Date,
  },
  { timestamps: true },
);

schema.statics.isClassPresent = async function (
  name: string,
  excludeClassId: mongoose.ObjectId,
) {
  return !!(await this.findOne({name,  _id: { $ne: excludeClassId } }));
};

const Class = model<IClassDoc, IClassModel>('Class', schema);

export default Class;
