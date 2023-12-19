import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from '@src/helper/asyncHandler';
import { basePath } from '@src/config/configManager';
import publicRoutes, { Header } from '@src/auth/publicRoutes';
import { AppLogger } from '@src/core/Logger';
import { AuthFailureError } from '@src/core/API_Handler/ApiError';
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
    } 

    return next();
  }),
);
