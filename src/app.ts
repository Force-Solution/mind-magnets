import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express';

import { json, urlencoded } from "body-parser";
import { basePath, environment, info, port } from '@src/config/configManager';
import { InternalError, NotFoundError } from '@src/core/API_Handler/ApiError';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { AppRouting } from '@src/appRouting';
import logger from '@src/core/Logger/logging';
import { AppLogger } from '@src/core/Logger';

export class App {
  public app: express.Express;
  private router: express.Router;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.configure();
  }

  private configure() {
    this.configureMiddleware();
    this.configureBaseRoute();
    // this.configureRoutes();
    this.errorHandler();
  }

  private configureMiddleware() {
    AppLogger.configureLogger();
    this.app.use(json({ limit: "50mb" }));
    this.app.use(urlencoded({ limit: "50mb", extended: true }));
    this.app.use(logger); // log request
  }

  private configureBaseRoute() {
    this.app.use((request, res, next) => {
      if (request.url === '/') {
        return Api.ok(request, res, info);
      } else {
        next();
      }
    });
    this.app.use(basePath, this.router);
    new AppRouting(this.router);
  }

  // private configureRoutes() {
  //   // cames for routes which does not present
  //   this.app.use((request: Request, _: Response, next: NextFunction) => {
  //     for (const key in request.query) {
  //       if (key) {
  //         request.query[key.toLowerCase()] = request.query[key];
  //       }
  //     }
  //     next();
  //   });
  // }

  private errorHandler() {
    this.app.use(
      (
        error: ErrorRequestHandler,
        request: Request,
        res: Response,
        _next: NextFunction,
      ) => {
        if (request.body) {
          AppLogger.error('Payload', JSON.stringify(request.body));
        }
        AppLogger.error('Error', error);
         return new InternalError(request, res);
      },
    );

    // catch 404 and forward to error handler
    this.app.use((request, res) => {
      const error =  "Route does not exist."
      new NotFoundError(request, res, error);
    });
  }

  public run() {
    this.app.listen(port);
    AppLogger.info(environment || "dev", 'Listen port at ' + port);
  }
}