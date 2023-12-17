import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from '@src/helper/asyncHandler';
import { basePath } from '@src/config/configManager';
import publicRoutes, { Header } from '@src/auth/publicRoutes';
// import { Api } from '../helper/appHelper';
import { AppLogger } from '@src/core/Logger';
import { AuthFailureError } from '@src/ErrorBoundary/ApiError';
const router = express.Router();

export default router.use(
  asyncHandler(async (request: Request, response: Response, next: NextFunction) => {

    if(publicRoutes.includes(request.url.slice(basePath.length))) return next();

    const authToken =
      request.headers[Header.AUTHORIZATION] ||
      request.headers[Header.API_KEY];

    if (!authToken) {
      AppLogger.error("Unauthorized Request: ", request.url);
      return new AuthFailureError(request, response, "Unauthorized Access" ); 
      // return Api.unauthorized(request, response, {message: "Unauthorized Access"});
    } 

    return next();
  }),
);
