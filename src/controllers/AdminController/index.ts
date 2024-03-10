import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';

import teacher from '@src/validation/schema/teacher';
import user from '@src/validation/schema/user';
import validator from '@src/validation/validator';

import { authorization } from '@src/auth/authorization';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { IRequest, ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';
import * as schemas from '@src/validation/schema/combinedSchema';

import { AdminService } from '@src/services/admin';
import { BatchService } from '@src/services/batch';
import { DepartmentService } from '@src/services/department';
import { PostService } from '@src/services/post';
import { StudentService } from '@src/services/student';
import { TeacherService } from '@src/services/teacher';

import { container } from '@src/inversify.config';
import { UserService } from '@src/services/user';

export class AdminController implements AppRoute {
  public route = '/admin';
  public router: Router = Router();

  private student: StudentService;
  private teacher: TeacherService;
  private post: PostService;
  private department: DepartmentService;
  private batch: BatchService;
  private admin: AdminService;
  private user: UserService;

  constructor() {
    this.router.post(
      '/student/create',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(schemas.studentRecordSchema),
      this.addStudent,
    );
    this.router.post(
      '/teacher/create',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(schemas.teacherRecordSchema),
      this.addTeacher,
    );

    this.router.post(
      '/post/create',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(teacher.createPost),
      this.createPost,
    );

    this.router.post(
      '/department/create',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(teacher.createDepartment),
      this.createDepartment,
    );

    this.router.post(
      '/batch/create',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(teacher.createBatch),
      this.createBatch,
    );

    this.router.get(
      '/batch',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization([IRole.Admin, IRole.Teacher]),
      validator(user.params, ValidationSource.QUERY),
      this.batchList,
    );

    this.router.get(
      '/department',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.params, ValidationSource.QUERY),
      this.departmentList,
    );

    this.router.get(
      '/post',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.params, ValidationSource.QUERY),
      this.postsList,
    );

    this.router.get(
      '/filteredUsers',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.params, ValidationSource.PARAM),
      this.getUsersAdded,
    );

    this.router.get(
      '/students/missed-installments/batch-wise',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      this.getStudMissedInstBatchWise,
    );

    this.router.get(
      '/teacher',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.params, ValidationSource.QUERY),
      this.getTeacherList,
    );

    this.batch = container.resolve<BatchService>(BatchService);
    this.student = container.resolve<StudentService>(StudentService);
    this.teacher = container.resolve<TeacherService>(TeacherService);
    this.department = container.resolve<DepartmentService>(DepartmentService);
    this.post = container.resolve<PostService>(PostService);
    this.admin =  container.resolve<AdminService>(AdminService);
    this.user =  container.resolve<UserService>(UserService);
  }

  private async addStudent(request: Request, response: Response): Promise<any> {
    try {
      const [_user, _createdStudent, _payment, token] =
        await this.user.createStudent(request.body);
      return Api.created(request, response, {
        message: 'Student Created',
        token,
      });
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async addTeacher(request: Request, response: Response): Promise<any> {
    try {
      const { sub } = (request as ExtendedRequest).decodedToken;
      await this.user.createTeacher(request.body, sub);
      return Api.created(request, response, 'Teacher Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async createPost(request: Request, response: Response): Promise<any> {
    try {
      await this.post.createPost(request.body);
      return Api.created(request, response, 'Post Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async createDepartment(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      await this.department.createDepartment(request.body);
      return Api.created(request, response, 'Department Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getStudMissedInstBatchWise(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const data = await this.student.countPendingPaymentsPerBatchByInst();
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getUsersAdded(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const { filter: duration } = request.query;

      const data = await this.admin.getFilteredUsers(duration as string);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getTeacherList(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const { page, size, search, sort, order } = request.query;
      const payload: Partial<IRequest> = {};

      if (page !== undefined) payload.page = page as string;
      if (size !== undefined) payload.size = size as string;
      if (search !== undefined) payload.search = search as string;
      if (sort !== undefined) payload.sort = sort as string;
      if (order !== undefined) payload.order = order as string;

      const data = await this.teacher.getTeachersList(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async departmentList(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const { page, size, search, sort, order } = request.query;
      const payload: Partial<IRequest> = {};

      if (page !== undefined) payload.page = page as string;
      if (size !== undefined) payload.size = size as string;
      if (search !== undefined) payload.search = search as string;
      if (sort !== undefined) payload.sort = sort as string;
      if (order !== undefined) payload.order = order as string;

      const data = await this.department.departmentList(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async postsList(request: Request, response: Response): Promise<any> {
    try {
      const { page, size, search, sort, order } = request.query;
      const payload: Partial<IRequest> = {};

      if (page !== undefined) payload.page = page as string;
      if (size !== undefined) payload.size = size as string;
      if (search !== undefined) payload.search = search as string;
      if (sort !== undefined) payload.sort = sort as string;
      if (order !== undefined) payload.order = order as string;

      const data = await this.post.postList(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async createBatch(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      await this.batch.createBatch(request.body);
      return Api.created(request, response, 'Batch Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async batchList(request: Request, response: Response): Promise<any> {
    try {
      const { page, size, search, sort, order } = request.query;
      const payload: Partial<IRequest> = {};

      if (page !== undefined) payload.page = page as string;
      if (size !== undefined) payload.size = size as string;
      if (search !== undefined) payload.search = search as string;
      if (sort !== undefined) payload.sort = sort as string;
      if (order !== undefined) payload.order = order as string;

      const data = await this.batch.batchList(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
}
