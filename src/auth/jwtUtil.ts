import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { BadTokenError } from '@src/core/API_Handler/ApiError';
import { tokenType } from '@src/types/token';
import { Header } from '@src/types/header';
import { ValidationSource } from '@src/types/request';
import { IRole } from '@src/types/roles';
import { tokenInfo } from '@src/config/configManager';
import * as ErrorBoundary from '@src/helper/ErrorHandling';

export interface ExtendedRequest extends Request {
  decodedToken: string | JwtPayload;
}

export const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const token = getToken(
      request[ValidationSource.HEADERS][Header.AUTHORIZATION],
    );
    const payload: string | JwtPayload = jwt.verify(
      token,
      tokenInfo.accessTokenSecret,
    );

    if (typeof payload !== 'string') validateTokenData(payload);

    (request as ExtendedRequest).decodedToken = payload;

    next();
  } catch (error) {
    ErrorBoundary.catchError(request, response, error);
  }
};

export const getToken = (authorization?: string): string => {
  if (!authorization || !authorization.startsWith('Bearer '))
    throw new BadTokenError();
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.sub ||
    !payload.iat ||
    !payload.exp ||
    !payload.aud ||
    !payload.type ||
    !Types.ObjectId.isValid(payload.sub) ||
    !validRole(payload.aud) ||
    !validTokenType(payload.type)
  ) {
    throw new BadTokenError();
  }
  return true;
};

export const validRole = (role: string | string[]): boolean =>
  [IRole.Admin, IRole.Parent, IRole.Teacher, IRole.Student].some(
    (r) => r === role,
  );
export const validTokenType = (type: string): boolean =>
  [
    tokenType.ACCESS,
    tokenType.REFRESH,
    tokenType.RESET_PASSWORD,
    tokenType.VERIFY_EMAIL,
  ].some((r) => r === type);
