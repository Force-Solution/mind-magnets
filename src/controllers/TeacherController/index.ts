import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import { authorization } from '@src/auth/authorization';
import { authenticate } from '@src/auth/jwtUtil';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import { ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';

import teacher from '@src/validation/schema/teacher';
import user from '@src/validation/schema/user';
import validator from '@src/validation/validator';
// import { IClass } from '@src/types/class';

//import * as classService from '@src/services/class';
import { Api } from '@src/core/API_Handler/ResponseHelper';

export class TeacherController implements AppRoute {
  public route = '/teacher';
  public router: Router = Router();

  constructor() {
    this.router.post(
      '/class/create',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Teacher),
      validator(teacher.createClass),
      this.createClass,
    );
  }

  private async createClass(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      // const { sub } = (request as ExtendedRequest).decodedToken;
      // const payload: IClass = {
      //   ...request.body,
      //   teacher: sub as string,
      // };
      //classService.createClass(payload);
      return Api.created(request, response, 'Class Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
}
