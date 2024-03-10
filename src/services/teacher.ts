import mongoose from 'mongoose';

import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { TeacherRepo } from '@src/dao/repository/TeacherRepo';
import { IRequest } from '@src/types/request';
import { Duration } from '@src/types/roles';
import { ITeacherDoc } from '@src/types/teacher';

import { NotificationType } from '@src/types/notifications';
import { IUser, IUserDoc } from '@src/types/user';


import { UserService } from '@src/services/user';
import { DepartmentService } from '@src/services/department';
import { NotificationService } from '@src/services/notifications';
import { PostService } from '@src/services/post';

export class TeacherService {
  user: UserService;
  department: DepartmentService;
  notification: NotificationService;
  post: PostService;
  teacher: TeacherRepo;
  constructor() {
    this.user = new UserService();
    this.department = new DepartmentService();
    this.notification = new NotificationService();
    this.post = new PostService();
    this.teacher = new TeacherRepo();
  }
  public async createTeacher(
    teacher: IUser & { department: string; post: string },
    _id: string | undefined,
  ): Promise<(IUserDoc | ITeacherDoc)[]> {
    const { department, post, ...rest } = teacher;

    const departmentDoc =
      await this.department.getDepartmentFromName(department);
    const postDoc = await this.post.getPostFromName(post);

    if (!departmentDoc) throw new BadRequestError('Department is not valid');
    if (!postDoc) throw new BadRequestError('Post is not valid');

    const user = await this.user.createUser(rest);

    const teacherPayload: Partial<ITeacherDoc> = {
      department: departmentDoc._id,
      post: postDoc._id,
      user: user._id,
    };

    const createdTeacher = await this.teacher.saveTeacher(teacherPayload);

    const notificationMsg = 'You have been added in application as teacher';
    await this.notification.createNotification(
      _id,
      user._id,
      NotificationType.USER_ADDITION,
      notificationMsg,
    );

    return Promise.all([user, createdTeacher]);
  }

  public async getTeachersData(duration: string) {
    if (!(duration === Duration.Monthly || duration === Duration.Weekly)) {
      throw new BadRequestError('Duration is not valid');
    }

    return await this.teacher.countTeachersByDuration(duration);
  }

  public async getTeachersList(
    payload: Partial<IRequest>,
  ): Promise<{ [key in string]: string | Object[] | number }> {
    const response = await this.teacher.getAllTeacherData(payload);
    return {
      data: response[0].data,
      totalElements: response[0].metadata[0].totalCount ?? 0,
      totalPages: Math.ceil(
        parseInt(response[0].metadata[0].totalCount ?? 0) /
          parseInt(payload.size ?? '0'),
      ),
    };
  }

  public async getTeacherFromUserId(userId: mongoose.Types.ObjectId) {
    return await this.teacher.getTeacherFromUserId(userId);
  }
}
