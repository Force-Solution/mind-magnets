import { Schema, model } from 'mongoose';
import { IAttendanceDoc } from '@src/types/attendance';

const attendanceSchema = new Schema<IAttendanceDoc>(
  {
    date: {
      type: Date,
      default: () => new Date(),
    },
    students: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        status: {
          type: String,
          enum: ['present', 'absent'],
          default: 'present',
        },
      },
    ],
  },
  { timestamps: true },
);

const Attendance = model<IAttendanceDoc>('Attendance', attendanceSchema);

export default Attendance;
