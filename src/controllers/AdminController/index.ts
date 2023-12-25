import { Router } from 'express';
import {Request, Response} from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
// import * as userService from '@src/services/user';
import * as adminService from '@src/services/admin';

export class AdminController implements AppRoute {
  public route = '/admin';
  public router: Router = Router();

  constructor() {
    // this.router.use(apiKey);
    // this.router.get('/', this.getCustomers);
    // this.router.get("/:id", this.getCustomer);
    this.router.post('/create/student', this.addUser);
    // this.router.put("/:id", this.updateCustomer);
    // this.router.delete("/:id", this.deleteCustomer);
  }

  public async addUser(request: Request, response: Response): Promise<any> {
    try{
      await adminService.createStudent(request.body);
    }catch(error){
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
