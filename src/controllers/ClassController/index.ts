import { AppRoute } from '@src/appRouting';
import validator from '@src/validation/validator';
import { Request, Response, Router } from 'express';

import { authorization } from '@src/auth/authorization';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import { ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';

import { Api } from '@src/core/API_Handler/ResponseHelper';
import classes from '@src/validation/schema/class';
import user from '@src/validation/schema/user';
import { ClassService } from '@src/services/class';

import { container } from '@src/inversify.config';
import { BadTokenError } from '@src/core/API_Handler/ApiError';

export class ClassController implements AppRoute {
  public route = '/class';
  public router: Router = Router();

  private class: ClassService;

  constructor() {
    this.router.post(
      '/create/:userId',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Teacher),
      validator(classes.createClass),
      this.addClass,
    );

    this.router.get(
      '/user/:userId',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization([IRole.Teacher, IRole.Student]),
      this.getClass,
    );

    this.router.get(
      '/:className',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization([IRole.Teacher, IRole.Student]),
      this.getClassByClassName,
    );

    this.class = container.resolve<ClassService>(ClassService);
  }
  private addClass = async (
    request: Request,
    response: Response,
  ): Promise<any> => {
    try {
      const { userId } = request.params;

      await this.class.createClass(request.body, userId);

      return Api.created(request, response, 'Class created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  };

  private getClass = async (
    request: Request,
    response: Response,
  ): Promise<any> => {
    try {
      const { userId } = request.params;
      const { aud } = (request as ExtendedRequest).decodedToken;

      if (typeof aud !== 'string')
        return new BadTokenError('Invalid token error');

      const classes = await this.class.getClass(userId, aud);

      return Api.ok(request, response, classes);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  };

  private getClassByClassName = async (
    request: Request,
    response: Response,
  ) => {
    try {
      const { className } = request.params;

      const classes = await this.class.getClassByClassName(className);
      return Api.ok(request, response, classes);

    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  };
}
