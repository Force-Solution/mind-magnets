import { Schema, model } from 'mongoose';
import { IStudentDoc, IStudentModel } from '@src/types/student';
import { validateEmail } from '@src/helper/util';

const schema = new Schema<IStudentDoc, IStudentModel>(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    batch: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    dateOfJoin: {
      type: Date,
      default: new Date(),
      index: true,
      trim: true,
    },
    address: {
      location: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zip: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    parentName: {
      type: String,
      trim: true,
    },
    parentEmail: {
      type: String,
      required: true,
      index: true,
      trim: true,
      validate: {
        validator: (value: string) => validateEmail(value),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
  },
  { timestamps: true },
);

const Student = model<IStudentDoc, IStudentModel>('Student', schema);

export default Student;
