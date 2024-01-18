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
    startTime: Date,
    endTime: Date,
  },
  { timestamps: true },
);

const Class = model<IClassDoc, IClassModel>('Class', schema);

export default Class;
