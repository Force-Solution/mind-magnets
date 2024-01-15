import { NextFunction, Request, Response } from 'express';

import RedisManager from '@src/config/redisConnection';
import { ValidationFailedError } from '@src/core/API_Handler/ApiError';
import { Api } from '@src/core/API_Handler/ResponseHelper';

interface RateLimiterRule {
  endpoint?: string;
  rateLimit: {
    time: number;
    limit: number;
  };
}

export const rateLimiter = (rule: RateLimiterRule) => {
  const { rateLimit } = rule;
  return async (request: Request, response: Response, next: NextFunction) => {
    const ip =
      request.headers['x-forwarded-for'] || // when using proxy servers then will use
      request.connection.remoteAddress ||
      request.ip;

    if(typeof ip !== "string") return new ValidationFailedError("Invalid headers");

    const requests = await new RedisManager().getClient().incr(ip);

    if(requests === 1){
        await new RedisManager().getClient().expire(ip, rateLimit.time);
    }

    if(requests > rateLimit.limit){
        return Api.tooMuchRequest(request, response, "Too Much Requests");
    }
    else next();

  };
};
