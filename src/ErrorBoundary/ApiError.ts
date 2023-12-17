import { ErrorRequestHandler, Request, Response } from 'express';

import { environment } from '@src/config/configManager';
import { Api } from '@src/helper/appHelper';

export type error = string | string[] | ErrorRequestHandler | Error;

export const enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError',
}

export abstract class ApiError extends Error {
  constructor(
    public request: Request,
    public response: Response,
    public type: ErrorType,
    public error: error = ['Error Occured'],
  ) {
    super(type);
    this.handle(request, response, type, error);
  }
  protected handle(
    request: Request,
    response: Response,
    type: ErrorType,
    error: string | string[] | ErrorRequestHandler | Error ,
  ) {
    switch (type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return Api.unauthorized(request, response, error);
      case ErrorType.INTERNAL:
        return Api.serverError(request, response, error);
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return Api.notFound(request, response, error);
      case ErrorType.BAD_REQUEST:
        return Api.badRequest(request, response, error);
      case ErrorType.FORBIDDEN:
        return Api.forbidden(request, response, error);
      default: {
        let message = error;
        // Do not send failure message in production as it may send sensitive data
        if (environment === 'production') message = 'Something wrong happened.';
        return Api.serverError(request, response, message);
      }
    }
  }
}

export class AuthFailureError extends ApiError {
  constructor(
    request: Request,
    response: Response,
    message = 'Invalid Credentials',
  ) {
    super(request, response, ErrorType.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(
    request: Request,
    response: Response,
    message: string | ErrorRequestHandler  = 'Internal error',
  ) {
    super(request, response, ErrorType.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(request: Request, response: Response, message = 'Bad Request') {
    super(request, response, ErrorType.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(request: Request, response: Response, message = 'Not Found') {
    super(request, response, ErrorType.NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(
    request: Request,
    response: Response,
    message = 'Permission denied',
  ) {
    super(request, response, ErrorType.FORBIDDEN, message);
  }
}

export class NoEntryError extends ApiError {
  constructor(
    request: Request,
    response: Response,
    message = "Entry don't exists",
  ) {
    super(request, response, ErrorType.NO_ENTRY, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(
    request: Request,
    response: Response,
    message = 'Token is not valid',
  ) {
    super(request, response, ErrorType.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(
    request: Request,
    response: Response,
    message = 'Token is expired',
  ) {
    super(request, response, ErrorType.TOKEN_EXPIRED, message);
  }
}

//   export class NoDataError extends ApiError {
//     constructor(message = 'No data available') {
//       super(ErrorType.NO_DATA, message);
//     }
//   }
