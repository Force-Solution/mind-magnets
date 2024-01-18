import { Document, Types } from 'mongoose';

interface IStudentAttendance {
  student: Types.ObjectId;
  status: 'present' | 'absent';
}

export interface IAttendanceDoc extends Document {
  date: Date;
  students: IStudentAttendance[];
}
