import { Router, Request, Response } from 'express';

import { AppRoute } from '@src/appRouting';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import validator from '@src/validation/validator';
import user from '@src/validation/schema/user';
import { ValidationSource } from '@src/types/request';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';

import * as userService from '@src/services/user';
import * as tokenService from '@src/services/token';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
export class LoginController implements AppRoute {
  public route = '/user';
  public router: Router = Router();

  constructor() {
    this.router.post('/login', validator(user.credential), this.getLoggedIn);
    this.router.get('/logout', validator(user.logout, ValidationSource.HEADERS), this.getLoggedOut);
    this.router.post('/create', validator(user.createUser), this.createUser);
    this.router.post('/signup', validator(user.signup), this.signUp);
    this.router.post(
      '/refreshtoken',
      validator(user.refreshToken, ValidationSource.HEADERS),
      this.refreshAuth,
    );

    // API that give KPI Cards Data
    this.router.get(
      '/dashboard/count/:userId',
      validator(user.auth, ValidationSource.HEADERS),
      authenticate,
      this.getDashboardCount,
    );
  }

  private async createUser(request: Request, response: Response): Promise<any> {
    try {
      const user = await userService.createUser(request.body);
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
      const user = await userService.loginWithEmailAndPassword(email, password);
      const tokens = await tokenService.generateToken(user);
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
      await userService.logout(refreshtoken as string);
      return Api.noContent(request, response);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getDashboardCount(request: Request, response: Response) {
    try {
      const { userId } = request.params;
      const { aud } = (request as ExtendedRequest).decodedToken;

      const data = await userService.getDashboardKPIData(userId, aud);
      return Api.ok(request, response, data);
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async signUp(request: Request, response: Response) {
    try {
      const { email, password, token } = request.body;
      await userService.addPasswordToUser(email, password, token);
      return Api.ok(request, response, 'Password Added');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async refreshAuth(request: Request, response: Response) {
    try {
      const { refreshToken } = request.headers;
      const user = await userService.refreshAuth(refreshToken as string);
      const tokens = await tokenService.generateToken(user);
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
