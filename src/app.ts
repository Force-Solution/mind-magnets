import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response
} from 'express';
import { json, urlencoded } from "body-parser";
import cors from 'cors';

import { AppRouting } from '@src/appRouting';
import { basePath, environment, info, port, rateLimiting } from '@src/config/configManager';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { AppLogger } from '@src/core/Logger';
import logger from '@src/core/Logger/logging';
import { morganMiddleware } from '@src/core/Logger/morgan.middleware';
import { rateLimiter } from '@src/auth/rateLimit';

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
    this.app.use(morganMiddleware);
    this.app.use(cors());
    this.app.use(rateLimiter(rateLimiting))  // for now I have put common, segregate on single route when required
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

  private errorHandler() {
    this.app.use(
      (
        error: ErrorRequestHandler,
        request: Request,
        response: Response,
        _next: NextFunction,
      ) => {
        if (request.body) {
          AppLogger.error('Payload', JSON.stringify(request.body));
        }
        AppLogger.error('Error', error);
        return Api.serverError(request, response, error);
      },
    );

    // catch 404 and forward to error handler
    this.app.use((request, response) => {
      const error =  "Route does not exist."
      return Api.notFound(request, response, error);
    });
  }

  public run() {
    this.app.listen(port);
    AppLogger.info(environment || "dev", 'Listen port at ' + port);
  }
}