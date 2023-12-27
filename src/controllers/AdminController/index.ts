import { Router } from 'express';
import { Request, Response } from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import * as adminService from '@src/services/admin';

import validator from '@src/validation/validator';
import user from '@src/validation/schema/user';
import student from '@src/validation/schema/student';
import teacher from '@src/validation/schema/teacher';
import payment from '@src/validation/schema/payment';

import { ValidationSource } from '@src/types/request';
import { authenticate } from '@src/auth/jwtUtil';
import { authorization } from '@src/auth/authorization';
import { IRole } from '@src/types/roles';

export class AdminController implements AppRoute {
  public route = '/admin';
  public router: Router = Router();

  constructor() {
    this.router.post(
      '/create/student',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.createUser),
      validator(student.createStudent),
      validator(payment.createPayment),
      this.addStudent,
    );
    this.router.post(
      '/create/teacher',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Admin),
      validator(user.createUser),
      validator(teacher.createTeacher),
      this.addTeacher,
    );
  }

  private async addStudent(request: Request, response: Response): Promise<any> {
    try {
      await adminService.createStudent(request.body);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async addTeacher(request: Request, response: Response): Promise<any> {
    try {
      await adminService.createTeacher(request.body);
    } catch (error) {
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
