import { Router, Request, Response } from 'express';
import { AppRoute } from '@src/appRouting';
// import { Api } from '@src/core/API_Handler/ResponseHelper';
// import validator from '@src/validation/validator';
// import login from '@src/validation/schema/login';
import { UserRepo } from '@src/dao/repository/UserRepo';

export class LoginController implements AppRoute {
  public route = '/login';
  public router: Router = Router();

  constructor() {
    this.router.post('/', this.getLoggedIn);
  }

  private async getLoggedIn(request: Request, response: Response):Promise<any> {
    const user = new UserRepo().createUser(request.body);
    response.status(201).json(user);
  }
}
