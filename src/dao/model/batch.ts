import { IBatchDoc, IBatchModel } from '@src/types/batch';
import { Schema, model } from 'mongoose';

const schema = new Schema<IBatchDoc, IBatchModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
  },
  { timestamps: true },
);

const Batch = model<IBatchDoc, IBatchModel>('Batch', schema);
export default Batch;
