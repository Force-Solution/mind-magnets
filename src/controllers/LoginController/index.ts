import { Router, Request, Response } from 'express';
import { AppRoute } from '@src/appRouting';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import validator from '@src/validation/validator';
import login from '@src/validation/schema/login';

export class LoginController implements AppRoute {
  public route = '/login';
  public router: Router = Router();

  constructor() {
    this.router.get('/', validator(login.credential), this.getLoggedIn);
  }

  private async getLoggedIn(request: Request, response: Response):Promise<any> {
    return Api.ok(request, response, "I am back");
  }
}
