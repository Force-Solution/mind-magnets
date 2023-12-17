'use strict';

import { Request, Response } from "express";
import { error } from "../ErrorBoundary/ApiError";

const _hasOwnProperty = Object.prototype.hasOwnProperty;

const Status = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNSUPPORTED_ACTION: 405,
  VALIDATION_FAILED: 422,
  SERVER_ERROR: 500,
  CREATED: 201,
};

function statusMessage(status: number) {
  switch (status) {
    case Status.BAD_REQUEST:
      return 'Bad Request';
    case Status.UNAUTHORIZED:
      return 'Unauthorized';
    case Status.FORBIDDEN:
      return 'Forbidden';
    case Status.NOT_FOUND:
      return 'Not Found';
    case Status.UNSUPPORTED_ACTION:
      return 'Unsupported Action';
    case Status.VALIDATION_FAILED:
      return 'Validation Failed';
    case Status.SERVER_ERROR:
      return 'Internal Server Error';
    case Status.CREATED:
      return 'Created';
  }
}

function jsonResponse(
  res: Response,
  body: any,
  options: { status?: any },
) {
  options = options || {};
  options.status = options.status || Status.OK;
  res.status(options.status).json(body || null);
}

const Api = {
  ok(_: Request, res: Response, data: any) {
    jsonResponse(res, data, {
      status: Status.OK,
    });
  },

  badRequest(_: Request, res: Response, errors: error) {
    const body = {
      message: statusMessage(Status.BAD_REQUEST),
      errors,
    };

    jsonResponse(res, body, {
      status: Status.BAD_REQUEST,
    });
  },

  unauthorized(_: Request, res: Response, error: error) {
    const body = {
      message: statusMessage(Status.UNAUTHORIZED),
      error,
    };

    jsonResponse(res, body, {
      status: Status.UNAUTHORIZED,
    });
  },

  forbidden(_: Request, res: Response, error: error) {
    const body = {
      message: statusMessage(Status.FORBIDDEN),
      error: error
    };

    jsonResponse(res, body, {
      status: Status.FORBIDDEN,
    });
  },

  notFound(_: Request, res: Response, error: error) {
    const body = {
      message: statusMessage(Status.NOT_FOUND),
      error
    };

    jsonResponse(res, body, {
      status: Status.NOT_FOUND,
    });
  },

  unsupportedAction(_: Request, res: Response, error:error) {
    const body = {
      message: statusMessage(Status.UNSUPPORTED_ACTION),
      error
    };

    jsonResponse(res, body, {
      status: Status.UNSUPPORTED_ACTION,
    });
  },

  invalid(_: Request, res: Response, errors: error) {
    const body = {
      message: statusMessage(Status.VALIDATION_FAILED),
      errors,
    };

    jsonResponse(res, body, {
      status: Status.VALIDATION_FAILED,
    });
  },
  serverError(_: Request, res: Response, error: error) {
    let composedErr;
    if (error instanceof Error) {
      composedErr = {
        message: error.message,
        stacktrace: error.stack,
      };
    }
    const body = {
      message: statusMessage(Status.SERVER_ERROR),
      composedErr,
    };

    jsonResponse(res, body, {
      status: Status.SERVER_ERROR,
    });
  },

  requireParams(
    request: Request,
    res: Response,
    parameters: any[],
    next: () => void,
  ) {
    const missing: string[] = [];

    parameters = Array.isArray(parameters) ? parameters : [parameters];

    parameters.forEach((parameter: PropertyKey) => {
      if (
        !(request.body && _hasOwnProperty.call(request.body, parameter)) &&
        !(request.params && _hasOwnProperty.call(request.params, parameter)) &&
        !_hasOwnProperty.call(request.query, parameter)
      ) {
        missing.push(`Missing required parameter: ${String(parameter)}`);
      }
    });

    if (missing.length) {
      Api.badRequest(request, res, missing);
    } else {
      next();
    }
  },

  created(_: Request, res: Response, data: any) {
    jsonResponse(res, data, {
      status: Status.OK,
    });
  },

  requireHeaders(
    request: Request,
    res: Response,
    headers: any[],
    next: () => void,
  ) {
    const missing: string[] = [];

    headers = Array.isArray(headers) ? headers : [headers];

    headers.forEach((header: PropertyKey) => {
      if (!(request.headers && _hasOwnProperty.call(request.headers, header))) {
        missing.push(`Missing required header parameter: ${String(header)}`);
      }
    });

    if (missing.length) {
      Api.badRequest(request, res, missing);
    } else {
      next();
    }
  },
};

export { Api };
