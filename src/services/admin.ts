import { IPayment, IPaymentDoc } from '@src/types/payment';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUser, IUserDoc } from '@src/types/user';
import { ITeacher, ITeacherDoc } from '@src/types/teacher';
import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { IDepartment, IDepartmentDoc } from '@src/types/department';
import { IPost, IPostDoc } from '@src/types/post';

import * as userService from '@src/services/user';
import * as studentService from '@src/services/student';
import * as paymentService from '@src/services/payment';
import * as teacherService from '@src/services/teacher';
import * as BatchService from '@src/services/batch';
import * as DepartmentService from '@src/services/department';
import * as PostService from '@src/services/post';
import * as NotificationService from '@src/services/notifications';
import * as tokenService from '@src/services/token';

import { IRequest } from '@src/types/request';
import { NotificationType } from '@src/types/notifications';

export const createStudent = async (
  student: IUser & IStudent & IPayment,
): Promise<(IUserDoc | IStudentDoc | IPaymentDoc | string)[]> => {
  const batch = await BatchService.getBatchByName(student.batch.toString());
  if (!batch) throw new BadRequestError('Batch Name not Found');
  student.batch = batch._id;

  const user = await userService.createUser(student);
  const payment = await paymentService.savePayment(student);
  const createdStudent = await studentService.createStudent(
    student,
    user,
    payment,
  );

  const token = await tokenService.generateVerifyEmailToken(user);
  return Promise.all([user, createdStudent, payment, token]);
};

export const createTeacher = async (
  teacher: IUser & ITeacher,
  _id: string | undefined,
): Promise<(IUserDoc | ITeacherDoc)[]> => {
  const isDepartmentPresent = await DepartmentService.isDepartmentPresentByName(
    teacher.department,
  );
  const isPostPresent = await PostService.isPostPresentByName(teacher.post);

  if (!isDepartmentPresent)
    throw new BadRequestError('Department is not valid');
  if (!isPostPresent) throw new BadRequestError('Post is not valid');

  const user = await userService.createUser(teacher);
  const createdTeacher = await teacherService.createTeacher(teacher, user);

  const notificationMsg = 'You have been added in application as teacher';
  await NotificationService.createNotification(
    _id,
    user._id,
    NotificationType.USER_ADDITION,
    notificationMsg,
  );

  return Promise.all([user, createdTeacher]);
};

export const createDepartment = async (
  department: IDepartment,
): Promise<IDepartmentDoc> => {
  return await DepartmentService.createDepartment(department);
};

export const createPost = async (post: IPost): Promise<IPostDoc> => {
  return await PostService.createPost(post);
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
): Promise<{
  students: {
    label: string;
    count: number;
  }[];
  teachers: {
    label: string;
    count: number;
  }[];
}> => {
  const students = await studentService.getStudentsData(duration);
  const teachers = await teacherService.getTeachersData(duration);

  const result = {
    students,
    teachers,
  };

  return result;
};

export const getTeachersListData = async (payload: IRequest) => {
  return await teacherService.getTeachersList(payload);
};
