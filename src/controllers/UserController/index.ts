import { Router, Request, Response } from 'express';

import { AppRoute } from '@src/appRouting';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import validator from '@src/validation/validator';
import user from '@src/validation/schema/user';
import * as userService from '@src/services/user';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import { TokenRepo } from '@src/dao/repository/TokenRepo';
import { ValidationSource } from '@src/types/request';
import { ExtendedRequest, authenticate } from '@src/auth/jwtUtil';

export class LoginController implements AppRoute {
  public route = '/user';
  public router: Router = Router();

  constructor() {
    this.router.post('/login', (req, _res, next) => {console.log(req.body); next()},validator(user.credential), this.getLoggedIn);
    this.router.post('/logout', validator(user.logout), this.getLoggedOut);
    this.router.post('/create', validator(user.createUser), this.createUser);

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
      console.log(email, password)
      const user = await userService.loginWithEmailAndPassword(email, password);
      const tokens = await new TokenRepo().generateAuthTokens(user);
      const userDetails={
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        role:user.role,
      }
      return Api.ok(request, response, { userDetails, tokens });
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }

  private async getLoggedOut(request: Request, response: Response) {
    try {
      const { refreshToken } = request.body;
      await userService.logout(refreshToken);
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
}
