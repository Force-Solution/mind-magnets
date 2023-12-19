import { Router } from 'express';
import { AdminController } from '@src/controllers/AdminController';
import { LoginController } from './controllers/LoginController';

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
  private configure() {
    this.addRoute(new AdminController());
    this.addRoute(new LoginController());
  }

  private addRoute(appRoute: AppRoute) {
    this.route.use(appRoute.route, appRoute.router);
  }
}
