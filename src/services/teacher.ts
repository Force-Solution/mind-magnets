import mongoose from 'mongoose';

import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { TeacherRepo } from '@src/dao/repository/TeacherRepo';
import { IRequest } from '@src/types/request';
import { Duration } from '@src/types/roles';
import { ITeacherDoc } from '@src/types/teacher';

import * as DepartmentService from '@src/services/department';
import * as NotificationService from '@src/services/notifications';
import * as PostService from '@src/services/post';
import * as userService from '@src/services/user';
import { NotificationType } from '@src/types/notifications';
import { IUser, IUserDoc } from '@src/types/user';

export const createTeacher = async (
  teacher: IUser & {department: string, post: string},
  _id: string | undefined,
): Promise<(IUserDoc | ITeacherDoc)[]> => {

  const {department, post, ...rest} = teacher;

  const departmentDoc = await DepartmentService.getDepartmentFromName(
   department,
  );
  const postDoc = await PostService.getPostFromName(post);

  if (!departmentDoc)
    throw new BadRequestError('Department is not valid');
  if (!postDoc) throw new BadRequestError('Post is not valid');

  const user = await userService.createUser(rest);

  const teacherPayload: Partial<ITeacherDoc> = {
    department: departmentDoc._id,
    post: postDoc._id,
    user: user._id
  }

  const createdTeacher = await new TeacherRepo().saveTeacher(teacherPayload);;

  const notificationMsg = 'You have been added in application as teacher';
  await NotificationService.createNotification(
    _id,
    user._id,
    NotificationType.USER_ADDITION,
    notificationMsg,
  );

  return Promise.all([user, createdTeacher]);
};

export const getTeachersData = async (duration: string) => {
  if (!(duration === Duration.Monthly || duration === Duration.Weekly)) {
    throw new BadRequestError('Duration is not valid');
  }

  return await new TeacherRepo().countTeachersByDuration(duration);
};

export const getTeachersList = async (
  payload: Partial<IRequest>,
): Promise<{ [key in string]: string | Object[] | number }> => {
  const response = await new TeacherRepo().getAllTeacherData(payload);
  return {
    data: response[0].data,
    totalElements: response[0].metadata[0].totalCount ?? 0,
    totalPages: Math.ceil(
      parseInt(response[0].metadata[0].totalCount ?? 0) / parseInt(payload.size ?? '0'),
    ),
  };
};

export const getTeacherFromUserId = async(userId: mongoose.Types.ObjectId) => {
  return await new TeacherRepo().getTeacherFromUserId(userId);
}