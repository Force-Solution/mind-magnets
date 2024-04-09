import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import { authorization } from '@src/auth/authorization';
import { authenticate } from '@src/auth/jwtUtil';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import { ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';

import { Api } from '@src/core/API_Handler/ResponseHelper';
import { container } from '@src/inversify.config';
import { TestService } from '@src/services/test';
import teacher from '@src/validation/schema/teacher';
import user from '@src/validation/schema/user';
import validator from '@src/validation/validator';

export class TestController implements AppRoute {
  public route = '/test';
  public router: Router = Router();
  private test: TestService;

  constructor() {
    this.router.post(
      '/create/:userId',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      authorization(IRole.Teacher),
      validator(teacher.createTest),
      this.createTest,
    );

    this.test = container.resolve<TestService>(TestService);
  }
  private async createTest(request: Request, response: Response): Promise<any> {
    try {
        const { userId } = request.params;
        await this.test.createTest(request.body, userId);
        return Api.created(request, response, 'Test Created');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
}
