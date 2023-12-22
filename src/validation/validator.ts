import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import { AppLogger } from '@src/core/Logger';
import { ValidationSource } from '@src/types/request';
import { Api } from '@src/core/API_Handler/ResponseHelper';

export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY,
  ) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(request[source]);
      if (!error) return next();

      const { details } = error;
      const message = details.map((i) => i.message.replace(/['"]+/g, ''));

      AppLogger.error('Request validation Error: ', message.join(','));
      return Api.badRequest(request, response, message);
    } catch (error) {
      next(error);
    }
  };
