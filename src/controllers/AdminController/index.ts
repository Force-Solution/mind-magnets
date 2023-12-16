import { Router, Request, Response} from 'express';
import { AppRoute } from '../../appRouting';
import { Api } from '../../helper/appHelper';

export class AdminController implements AppRoute {
  public route = '/admin';
  public router: Router = Router();

  constructor() {
    this.router.get('/', this.getCustomers);
    // this.router.get("/:id", this.getCustomer);
    // this.router.post("/", this.addCustomer);
    // this.router.put("/:id", this.updateCustomer);
    // this.router.delete("/:id", this.deleteCustomer);
  }

  public async getCustomers(
    request: Request,
    response: Response,
  ): Promise<any> {
    // const helper = new SqlHelper('select * from customer');
    // const results = await helper.select();
    return Api.ok(request, response, "I am back");
  }
}
