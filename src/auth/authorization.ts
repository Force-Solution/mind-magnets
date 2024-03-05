import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { ExtendedRequest } from '@src/auth/jwtUtil';
import { BadTokenError, ForbiddenError } from '@src/core/API_Handler/ApiError';
import * as ErrorBoundary from '@src/helper/ErrorHandling';
import { IRole } from '@src/types/roles';

export const authorization =
  (authorizedRoles: IRole[] | IRole) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      const token: JwtPayload | string = (request as ExtendedRequest)
        .decodedToken;

      if (typeof token === 'string') throw new BadTokenError();

      const currentUserRole = token.aud;

      if (
        (Array.isArray(authorizedRoles) &&
          !authorizedRoles.includes(currentUserRole as IRole)) ||
        (typeof authorizedRoles === "string" && authorizedRoles !== currentUserRole)
      )
        throw new ForbiddenError();

      next();
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  };
