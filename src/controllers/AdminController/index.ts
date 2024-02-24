import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import * as adminService from '@src/services/admin';

import teacher from '@src/validation/schema/teacher';
import user from '@src/validation/schema/user';
import validator from '@src/validation/validator';

import { authorization } from '@src/auth/authorization';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';
import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { IRequest, ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';
import * as schemas from '@src/validation/schema/combinedSchema';

export class AdminController implements AppRoute {
  public route = '/admin';
  public router: Router = Router();

  constructor() {
    this.router.post(
      '/create/student',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(schemas.studentRecordSchema),
      this.addStudent,
    );
    this.router.post(
      '/create/teacher',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(schemas.teacherRecordSchema),
      this.addTeacher,
    );

    this.router.post(
      '/create/post',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(teacher.createPost),
      this.createPost,
    );

    this.router.post(
      '/create/department',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(teacher.createDepartment),
      this.createDepartment,
    );

    this.router.get(
      '/department',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.params, ValidationSource.QUERY),
      this.departmentList
    );

    this.router.get(
      '/getUsersAdded',
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
      '/getTeachersList',
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
        await adminService.createStudent(request.body);
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
      await adminService.createTeacher(request.body, sub);
      return Api.created(request, response, 'Teacher Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async createPost(request: Request, response: Response): Promise<any> {
    try {
      await adminService.createPost(request.body);
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
      await adminService.createDepartment(request.body);
      return Api.created(request, response, 'Post Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getStudMissedInstBatchWise(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const data = await adminService.getStudentMissedInstBatchWise();
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
      if (typeof duration !== 'string')
        throw new BadRequestError('Invalid Params');

      const data = await adminService.getFilteredUsers(duration);
      return Api.ok(request, response, data);
    } catch (error) {
      console.log(error);
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getTeacherList(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const { page, size, search, sort, order } = request.query;
      if (
        ![page, size, search, sort, order].every(
          (param) => typeof param === 'string' || typeof param === undefined,
        )
      )
        throw new BadRequestError('Invalid Params');
      const payload: IRequest = {
        page: page as string,
        size: size as string,
        search: search as string,
        sort: sort as string,
        order: order as string,
      };
      const data = await adminService.getTeachersListData(payload);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async departmentList( request: Request,
    response: Response,
  ): Promise<any> {
    try{
      const { page, size, search, sort, order } = request.query;
      if (
        ![page, size, search, sort, order].every(
          (param) => typeof param === 'string' || typeof param === undefined,
        )
      )
        throw new BadRequestError('Invalid Params');
      const payload: IRequest = {
        page: page as string,
        size: size as string,
        search: search as string,
        sort: sort as string,
        order: order as string,
      };

      const data = await adminService.getDepartmentList(payload);
      return Api.ok(request, response, data);

    }catch(error){
      ErrorBoundary.catchError(request, response, error);
    }
  }

  // public async getCustomers(
  //   request: Request,
  //   response: Response,
  // ): Promise<any> {
  // const helper = new SqlHelper('select * from customer');
  // const results = await helper.select();
  // return new InternalError(request, response);
  // }
}
