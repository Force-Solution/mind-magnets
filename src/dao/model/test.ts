import { ITestDoc, ITestModel } from '@src/types/test';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<ITestDoc, ITestModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    batch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    class:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maximumMarks:{
        type: Number,
        required: true,
    },
    type:{
      type: String,
      default: 'publish'
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    }
  },
  { timestamps: true },
);

const Test = model<ITestDoc, ITestModel>('Test', schema);

export default Test;