import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import * as adminService from '@src/services/admin';

import user from '@src/validation/schema/user';
import validator from '@src/validation/validator';

import { authorization } from '@src/auth/authorization';
import { authenticate } from '@src/auth/jwtUtil';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';
import * as schemas from '@src/validation/schema/combinedSchema';
import { BadRequestError } from '@src/core/API_Handler/ApiError';

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
  }

  private async addStudent(request: Request, response: Response): Promise<any> {
    try {
      await adminService.createStudent(request.body);
      return Api.created(request, response, "Student Created");
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async addTeacher(request: Request, response: Response): Promise<any> {
    try {
      await adminService.createTeacher(request.body);
      return Api.created(request, response, "Teacher Created");
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
      console.log(error)
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
