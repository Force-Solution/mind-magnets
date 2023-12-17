import { Router, Request, Response } from 'express';
import { AppRoute } from '../../appRouting';
import { Api } from '../../helper/appHelper';

export class LoginController implements AppRoute {
  public route = '/login';
  public router: Router = Router();

  constructor() {
    this.router.get('/', this.getLoggedIn);
  }

  private async getLoggedIn(request: Request, response: Response):Promise<any> {
    return Api.ok(request, response, "I am back");
  }
}
