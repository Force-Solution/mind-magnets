import { IPayment, IPaymentDoc } from '@src/types/payment';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUser, IUserDoc } from '@src/types/user';
import { ITeacher, ITeacherDoc } from '@src/types/teacher';
import { BadRequestError } from '@src/core/API_Handler/ApiError';

import * as userService from '@src/services/user';
import * as studentService from '@src/services/student';
import * as paymentService from '@src/services/payment';
import * as teacherService from '@src/services/teacher';
import * as BatchService from '@src/services/batch';

export const createStudent = async (
  student: IUser & IStudent & IPayment,
): Promise<(IUserDoc | IStudentDoc | IPaymentDoc)[]> => {
  const batch = await BatchService.getBatchByName(student.batch);
  if (!batch) throw new BadRequestError('Batch Name not Found');
  student.batch = batch._id.toString();

  const user = await userService.createUser(student);
  const createdStudent = await studentService.createStudent(student, user);
  const payment = await paymentService.savePayment(student, createdStudent);

  return Promise.all([user, createdStudent, payment]);
};

export const createTeacher = async (
  teacher: IUser & ITeacher,
): Promise<(IUserDoc | ITeacherDoc)[]> => {
  const user = await userService.createUser(teacher);
  const createdTeacher = await teacherService.createTeacher(teacher, user);
  return Promise.all([user, createdTeacher]);
};

export const getStudentMissedInstBatchWise = async (): Promise<
  {
    batch: string;
    count: number;
  }[]
> => {
  return await studentService.countPendingPaymentsPerBatchByInst();
};

export const getFilteredUsers = async (
  duration: string,
): Promise<
  [
    {
      label: string;
      count: number;
    }[],
    {
      label: string;
      count: number;
    }[],
  ]
> => {
  const students = await studentService.getStudentsData(duration);
  const teachers = await teacherService.getTeachersData(duration);

  return Promise.all([students, teachers]);
};
