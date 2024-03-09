import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import * as adminService from '@src/services/admin';

import teacher from '@src/validation/schema/teacher';
import user from '@src/validation/schema/user';
import validator from '@src/validation/validator';

import { authorization } from '@src/auth/authorization';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { IRequest, ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';
import * as schemas from '@src/validation/schema/combinedSchema';

import * as studentService from '@src/services/student';
import * as teacherService from '@src/services/teacher';
import * as postService from '@src/services/post';
import * as departmentService from '@src/services/department';
import * as batchService from '@src/services/batch';

export class AdminController implements AppRoute {
  public route = '/admin';
  public router: Router = Router();

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
  }

  private async addStudent(request: Request, response: Response): Promise<any> {
    try {
      const [_user, _createdStudent, _payment, token] =
      await studentService.createStudent(request.body);
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
      await teacherService.createTeacher(request.body, sub);
      return Api.created(request, response, 'Teacher Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async createPost(request: Request, response: Response): Promise<any> {
    try {
      await postService.createPost(request.body);
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
      await departmentService.createDepartment(request.body);
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
      const data = await studentService.countPendingPaymentsPerBatchByInst();
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

      const data = await adminService.getFilteredUsers(duration as string);
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

      const data = await teacherService.getTeachersList(payload);
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

      const data = await departmentService.departmentList(payload);
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

      const data = await postService.postList(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async createBatch(request: Request, response: Response): Promise<any> {
    try {
      await batchService.createBatch(request.body);
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

      const data = await batchService.batchList(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
}
