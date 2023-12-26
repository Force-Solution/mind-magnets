import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { ExtendedRequest } from '@src/auth/jwtUtil';
import { BadTokenError, ForbiddenError } from '@src/core/API_Handler/ApiError';
import * as ErrorBoundary from '@src/helper/ErrorHandling';

export const authorization =
  (...authorizedRoles: string[]) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      const token: JwtPayload | string = (request as ExtendedRequest)
        .decodedToken;

      if (typeof token === 'string') throw new BadTokenError();

      const currentUserRole = token.aud;

      if (!authorizedRoles.includes(currentUserRole as string))
        throw new ForbiddenError();

      next();
    } catch (error) {
        ErrorBoundary.catchError(request, response, error);
    }
  };
