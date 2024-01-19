import { IMarksDoc, IMarksModel } from '@src/types/marks';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<IMarksDoc, IMarksModel>(
  {
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    marksObtained:{
        type: Number,
        required: true,
    }
  },
  { timestamps: true },
);

const Marks = model<IMarksDoc, IMarksModel>('Marks', schema);

export default Marks;