import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import { AppLogger } from './core/Logger';
import { basePath, environment, info, port } from './config/configManager';
import { Api } from './helper/appHelper';
import { AppRouting } from './appRouting';

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
    this.configureRoutes();
    this.errorHandler();
  }

  private configureMiddleware() {
    // this.app.use(json({ limit: '50mb' }));
    // this.app.use(compression());
    // this.app.use(urlencoded({ limit: '50mb', extended: true }));
    AppLogger.configureLogger();
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

  private configureRoutes() {
    this.app.use((request: Request, _: Response, next: NextFunction) => {
      for (const key in request.query) {
        if (key) {
          request.query[key.toLowerCase()] = request.query[key];
        }
      }
      next();
    });
  }

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
        Api.serverError(request, res, error);
      },
    );

    // catch 404 and forward to error handler
    this.app.use((request, res) => {
      Api.notFound(request, res);
    });
  }

  public run() {
    const listeningPort = port ??  80;
    this.app.listen(listeningPort);
    AppLogger.info(environment ?? 'development', 'Listen port at ' + listeningPort);
  }
}
