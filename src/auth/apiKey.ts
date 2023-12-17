import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from '../helper/asyncHandler';
import { basePath } from '../config/configManager';
import publicRoutes, { Header } from './publicRoutes';
import { Api } from '../helper/appHelper';
import { AppLogger } from '../core/Logger';
import { AuthFailureError } from '../ErrorBoundary/ApiError';
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
