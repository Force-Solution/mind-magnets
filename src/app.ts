import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';

import { AppRouting } from '@src/appRouting';
import {
  basePath,
  environment,
  info,
  port,
  rateLimiting,
} from '@src/config/configManager';
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
    this.app.use(cors());
    this.app.options('/*', this.configureOptions);
    this.app.use(json({ limit: '50mb' }));
    this.app.use(urlencoded({ limit: '50mb', extended: true }));
    this.app.use(logger); // log request
    this.app.use(morganMiddleware);
    this.app.use(rateLimiter(rateLimiting)); // for now I have put common, segregate on single route when required
    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
      //intercepts OPTIONS method
      if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
      }
      else {
      //move on
        next();
      }
  });
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
      const error = 'Route does not exist.';
      return Api.notFound(request, response, error);
    });
  }

  private configureOptions(_request: Request, response: Response){
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    response.send(200);
  } 

  public run() {
    this.app.listen(port);
    AppLogger.info(environment || 'dev', 'Listen port at ' + port);
  }
}
