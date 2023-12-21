import { Router, Request, Response } from 'express';
import { AppRoute } from '@src/appRouting';
// import { Api } from '@src/core/API_Handler/ResponseHelper';
// import validator from '@src/validation/validator';
// import login from '@src/validation/schema/login';
import { UserRepo } from '@src/dao/repository/UserRepo';
import { BadRequestError, InternalError } from '@src/core/API_Handler/ApiError';
import { Api } from '@src/core/API_Handler/ResponseHelper';

export class LoginController implements AppRoute {
  public route = '/user';
  public router: Router = Router();

  constructor() {
    this.router.get('/login', this.getLoggedIn);
    this.router.post('/create', this.createUser);
  }

  private async createUser(request: Request, response: Response):Promise<any>{
    try{
      const user = new UserRepo().createUser(request.body);
      return Api.created(request, response, user);

    }catch(error){
      if(error instanceof BadRequestError){
        return Api.badRequest(request, response, error.getErrorMsg());
      }
    }
  }

  private async getLoggedIn(request: Request, response: Response):Promise<any> {
    // response.status(201).json(user);
  }
}
