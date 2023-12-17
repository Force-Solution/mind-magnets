import { Router } from 'express';
import { AdminController } from '@src/controllers/AdminController';
// import { CustomerController } from "./controller/customer.controller";

export interface AppRoute {
  route: string;
  router: Router;
}

export class AppRouting {
   route: Router;
  constructor( route: Router) {
    this.route = route;
    this.configure();
  }
  public configure() {
    // Add the routing classes.
    this.addRoute(new AdminController());
  }

  private addRoute(appRoute: AppRoute) {
    this.route.use(appRoute.route, appRoute.router);
  }
}
