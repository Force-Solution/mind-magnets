import { Router, Request, Response } from 'express';

import { AppRoute } from '@src/appRouting';
import { UserRepo } from '@src/dao/repository/UserRepo';
import {
  AuthFailureError,
  BadRequestError,
} from '@src/core/API_Handler/ApiError';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import validator from '@src/validation/validator';
import user  from '@src/validation/schema/user';

export class LoginController implements AppRoute {
  public route = '/user';
  public router: Router = Router();

  constructor() {
    this.router.post('/login', validator(user.credential), this.getLoggedIn);
    this.router.post('/create', validator(user.createUser), this.createUser);
  }

  private async createUser(request: Request, response: Response): Promise<any> {
    try {
      const user = new UserRepo().createUser(request.body);
      return Api.created(request, response, user);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return Api.badRequest(request, response, error.getErrorMsg());
      }
    }
  }

  private async getLoggedIn(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const { email, password } = request.body;
      const user = await new UserRepo().getUserByEmail(email);

      if (!user ||!user.isPasswordMatch(password)) throw new AuthFailureError();
      else return Api.ok(request, response, 'LoggedIN');
      
    } catch (error) {
      if (error instanceof AuthFailureError) {
        return Api.unauthorized(request, response, error.getErrorMsg());
      }
    }
  }
}
