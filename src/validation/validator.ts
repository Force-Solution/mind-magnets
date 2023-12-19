import Joi from 'joi';
import { Request, Response, NextFunction } from  "express";
import { AppLogger } from '@src/core/Logger';
import {  BadRequestError } from '@src/core/API_Handler/ApiError';

export const enum ValidationSource {
  HEADERS = 'headers',
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'params',
}

export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY,
  ) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
        const {error} = schema.validate(request[source]);
        if(!error) return next();
        
        const {details} = error;
        const message = details.map(i => i.message.replace(/['"]+/g, ''))
        
        AppLogger.error('Request validation Error: ', message.join(','));
        return new BadRequestError(request, response, message);

    } catch (error) {
      next(error);
    }
  };
