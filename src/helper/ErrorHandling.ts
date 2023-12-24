import { Request, Response } from 'express';
import {
  ApiError,
  AuthFailureError,
  BadRequestError,
  BadTokenError,
  ForbiddenError,
  InternalError,
  NoEntryError,
  NotFoundError,
  TokenExpiredError,
} from '@src/core/API_Handler/ApiError';
import { Api } from '@src/core/API_Handler/ResponseHelper';
import { AppLogger } from '@src/core/Logger';

export const catchError = (
  request: Request,
  response: Response,
  error: ApiError | any,
) => {
    AppLogger.error("Error Occured while processing request", error.getErrorMsg() || error.message);
  if (
    error instanceof AuthFailureError ||
    error instanceof BadTokenError ||
    error instanceof TokenExpiredError
  ) {
    return Api.unauthorized(request, response, error.getErrorMsg());
  } else if (error instanceof InternalError) {
    return Api.serverError(request, response, error.getErrorMsg());
  } else if (error instanceof BadRequestError) {
    return Api.badRequest(request, response, error.getErrorMsg());
  } else if (error instanceof NotFoundError || error instanceof NoEntryError) {
    return Api.notFound(request, response, error.getErrorMsg());
  } else if (error instanceof ForbiddenError) {
    return Api.forbidden(request, response, error.getErrorMsg());
  }
  else{
    
  }
};
