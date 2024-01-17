import { IBatchDoc, IBatchModel } from '@src/types/batch';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<IBatchDoc, IBatchModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    classes:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Class',
      default: []
    }
  },
  { timestamps: true },
);

const Batch = model<IBatchDoc, IBatchModel>('Batch', schema);
export default Batch;
