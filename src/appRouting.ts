import { Router } from 'express';
import { AdminController } from '@src/controllers/AdminController';
import { LoginController } from '@src/controllers/UserController';
import swaggerUi from 'swagger-ui-express';
import { specs } from '@src/docs/swaggerConfig';
import {SWAGGER_URL} from '@src/config/configManager';
import { ClassController } from './controllers/ClassController';
import { TeacherController } from './controllers/TeacherController';
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
    this.configureSwagger();
    this.addRoute(new AdminController());
    this.addRoute(new LoginController());
    this.addRoute(new ClassController());
    this.addRoute(new TeacherController());
  }

  private addRoute(appRoute: AppRoute) {
    this.route.use(appRoute.route, appRoute.router);
  }
  private configureSwagger(){
    this.route.use(SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(specs));
  }
}
