import { Router, Request, Response } from 'express';

import { AppRoute } from '@src/appRouting';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import validator from '@src/validation/validator';
import user from '@src/validation/schema/user';
import { ValidationSource } from '@src/types/request';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';

import {UserService} from '@src/services/user';
import {TokenService} from '@src/services/token';
import * as ErrorBoundary from '@src/helper/ErrorHandling';

import { container } from '@src/inversify.config';

export class LoginController implements AppRoute {
  public route = '/user';
  public router: Router = Router();

  private user: UserService;
  private token: TokenService;

  constructor() {
    this.router.post('/login', validator(user.credential), this.getLoggedIn.bind(this));
    this.router.get('/logout', validator(user.logout, ValidationSource.HEADERS), this.getLoggedOut.bind(this));
    this.router.post('/create', validator(user.createUser), this.createUser.bind(this));
    this.router.post('/signup', validator(user.signup), this.signUp.bind(this));
    this.router.post(
      '/refreshtoken',
      validator(user.refreshToken, ValidationSource.HEADERS),
      this.refreshAuth.bind(this),
    );

    // API that give KPI Cards Data
    this.router.get(
      '/dashboard/count/:userId',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      this.getDashboardCount.bind(this),
    );

    this.user = container.resolve<UserService>(UserService);
    this.token = container.resolve<TokenService>(TokenService);
  }

  private async createUser(request: Request, response: Response): Promise<any> {
    try {
      const user = await this.user.createUser(request.body);
      return Api.created(request, response, user);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getLoggedIn(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      const { email, password } = request.body;
      const user = await this.user.loginWithEmailAndPassword(email, password);
      const tokens = await this.token.generateToken(user);
      const userDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        userId: user.userId
      };
      return Api.ok(request, response, { userDetails, tokens });
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getLoggedOut(request: Request, response: Response) {
    try {
      const { refreshtoken } = request.headers;
      await this.user.logout(refreshtoken as string);
      return Api.noContent(request, response);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getDashboardCount(request: Request, response: Response) {
    try {
      const { userId } = request.params;
      const { aud } = (request as ExtendedRequest).decodedToken;

      const data = await this.user.getDashboardKPIData(userId, aud);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async signUp(request: Request, response: Response) {
    try {
      const { email, password, token } = request.body;
      await this.user.addPasswordToUser(email, password, token);
      return Api.ok(request, response, 'Password Added');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async refreshAuth(request: Request, response: Response) {
    try {
      const { refreshToken } = request.headers;
      const user = await this.user.refreshAuth(refreshToken as string);
      const tokens = await this.token.generateToken(user);
      const userDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
      return Api.ok(request, response, { userDetails, tokens });
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
}
