import {
  AuthFailureError,
  BadRequestError,
  BadTokenError,
  NotFoundError,
} from '@src/core/API_Handler/ApiError';

import { IRole } from '@src/types/roles';
import { tokenType } from '@src/types/token';
import { IUser, IUserDoc } from '@src/types/user';

import { UserRepo } from '@src/dao/repository/UserRepo';
import { IPayment, IPaymentDoc, PaymentTypes } from '@src/types/payment';
import { PaymentService } from '@src/services/payment';
import { TokenService } from '@src/services/token';
import { TestService } from '@src/services/test';
import { TeacherService } from '@src/services/teacher';
import { PostService } from '@src/services/post';
import { DepartmentService } from '@src/services/department';
import { inject, injectable } from 'inversify';
import { TYPES } from '@src/types/types';
import { ITeacherDoc } from '@src/types/teacher';
import { NotificationService } from '@src/services/notifications';
import { NotificationType } from '@src/types/notifications';
import { IStudent, IStudentDoc } from '@src/types/student';
import { BatchService } from '@src/services/batch';
import { StudentService } from '@src/services/student';
@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepo) private user: UserRepo,
    @inject(TYPES.PaymentService) private payment: PaymentService,
    @inject(TYPES.TokenService) private token: TokenService,
    @inject(TYPES.TestService) private test: TestService,
    @inject(TYPES.TeacherService) private teacher: TeacherService,
    @inject(TYPES.StudentService) private student: StudentService,
    @inject(TYPES.BatchService) private batch: BatchService,
    @inject(TYPES.DepartmentService) private department: DepartmentService,
    @inject(TYPES.PostService) private post: PostService,
    @inject(TYPES.NotificationService) private notification: NotificationService,
  ) {}

  public async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<IUserDoc> {
    const user = await this.user.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new AuthFailureError('Incorrect email or password');
    }
    return user;
  }

  public async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await this.token.verifyToken({
      token: refreshToken,
      type: tokenType.REFRESH,
      blacklisted: false,
    });

    if (!refreshTokenDoc) throw new NotFoundError();

    await this.token.deleteToken(refreshTokenDoc);
  }

  public async refreshAuth(refreshToken: string): Promise<IUserDoc> {
    try {
      const refreshTokenDoc = await this.token.verifyToken({
        token: refreshToken,
        type: tokenType.REFRESH,
        blacklisted: false,
      });
      if (!refreshTokenDoc) throw new NotFoundError();

      const user = await this.user.getUserById(refreshTokenDoc.user);
      if (!user) throw new AuthFailureError('Invalid token');

      await this.token.deleteToken(refreshTokenDoc);

      return user;
    } catch (error) {
      throw new AuthFailureError('Invalid token');
    }
  }

  public async createUser(user: IUser): Promise<IUserDoc> {
    return await this.user.createUser(user);
  }

  public async getDashboardKPIData(
    userId: number | string,
    role: string | string[] | undefined,
  ) {
    if (typeof role !== 'string') throw new BadTokenError();

    if (role === IRole.Admin) {
      const teachers = await this.user.countUserByRole(IRole.Teacher);
      const students = await this.user.countUserByRole(IRole.Student);
      const pendingDueByInstallments =
        await this.payment.getPaymentPendingCountByType(
          PaymentTypes.Installments,
        );

      return {
        teacherCount: teachers,
        studentCount: students,
        pendingDueByInstallments,
      };
    } else if (role === IRole.Teacher) {
      const user = await this.getUserByUserId(userId);
      if (!user) return;

      const teacher = await this.teacher.getTeacherFromUserId(user._id);
      const countAllTests = await this.test.countAllTestsByTeacher(teacher?.id);
      const averageStudentsPerformance =
        await this.test.getAveragePerformanceByTeacher(teacher?.id);

      return {
        totalClasses: teacher?.classes.length,
        totalTest: countAllTests,
        averageStudentsPerformance,
      };
    } else if (role === IRole.Parent) {
    } else if (role === IRole.Student) {
      const totalClasses = await this.student.countTotalClass(userId);
      console.log(totalClasses);
    } else {
      throw new BadTokenError();
    }
  }

  public async addPasswordToUser(
    email: string,
    password: string,
    tokenStr: string,
  ): Promise<IUserDoc | null> {
    const tokenDoc = await this.token.verifyTokenByType(
      tokenStr,
      tokenType.VERIFY_EMAIL,
    );
    const user = await this.user.getUserByEmail(email);

    if (!tokenDoc || !user || tokenDoc.user.toString() !== user._id.toString())
      throw new BadTokenError();

    user.password = password;
    user.isEmailVerified = true;

    return await this.user.updateUserPassword(user);
  }

  public async getUserByUserId(
    userId: number | string,
  ): Promise<IUserDoc | null> {
    return await this.user.getUserByUserId(userId);
  }

  public async createTeacher(
    teacher: IUser & { department: string; post: string },
    _id: string | undefined, // from JWT
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

  public async createStudent(
    student: IUser & IStudent & IPayment,
  ): Promise<(IUserDoc | IStudentDoc | IPaymentDoc | string)[]> {
    const batch = await this.batch.getBatchByName(student.batch.toString());
    if (!batch) throw new BadRequestError('Batch Name not Found');
    student.batch = batch._id;

    const user = await this.createUser(student);
    const payment = await this.payment.savePayment(student);

    const payload = {
      ...student,
      user: user._id,
      payment: payment._id,
    };
    const createdStudent = await this.student.saveStudent(payload);

    const token = await this.token.generateVerifyEmailToken(user);
    return Promise.all([user, createdStudent, payment, token]);
  }

}
