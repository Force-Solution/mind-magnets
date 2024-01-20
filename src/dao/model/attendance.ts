import { IAttendanceDoc, IAttendanceModel } from '@src/types/attendance';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<IAttendanceDoc, IAttendanceModel>(
  {
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
    user:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    }
  },
  { timestamps: true },
);

const Attendance = model<IAttendanceDoc, IAttendanceModel>('Attendance', schema);

export default Attendance;
