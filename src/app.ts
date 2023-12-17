import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express';

import { basePath, environment, info, port } from '@src/config/configManager';
import { InternalError, NotFoundError } from '@src/ErrorBoundary/ApiError';
import { Api } from '@src/helper/appHelper';
import { AppRouting } from '@src/appRouting';
import logger from '@src/core/logging';
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
        new InternalError(request, res, error);
      },
    );

    // catch 404 and forward to error handler
    this.app.use((request, res) => {
      const error =  "Route does not exist."
      new NotFoundError(request, res, error);
    });
  }

  public run() {
    const listeningPort = port ??  80;
    this.app.listen(listeningPort);
    AppLogger.info(environment ?? 'development', 'Listen port at ' + listeningPort);
  }
}