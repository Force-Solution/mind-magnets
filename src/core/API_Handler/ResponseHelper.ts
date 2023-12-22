'use strict';

import { Request, Response } from "express";

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
  response: Response,
  body: any,
  options: { status?: any },
) {
  options = options || {};
  options.status = options.status || Status.OK;
  response.status(options.status).json(body || null);
}

const Api = {
  ok(_: Request, response: Response, data: any) {
    jsonResponse(response, data, {
      status: Status.OK,
    });
  },

  created(_:Request, response: Response, data:any){
    jsonResponse(response, data, {
      status: Status.CREATED,
    });
  },

  badRequest(_: Request, response: Response, errors:any) {
    const body = {
      message: statusMessage(Status.BAD_REQUEST),
      errors,
    };

    jsonResponse(response, body, {
      status: Status.BAD_REQUEST,
    });
  },

  unauthorized(_: Request, response: Response, error:any) {
    const body = {
      message: statusMessage(Status.UNAUTHORIZED),
      error,
    };

    jsonResponse(response, body, {
      status: Status.UNAUTHORIZED,
    });
  },

  forbidden(_: Request, response: Response, error:any) {
    const body = {
      message: statusMessage(Status.FORBIDDEN),
      error: error
    };

    jsonResponse(response, body, {
      status: Status.FORBIDDEN,
    });
  },

  notFound(_: Request, response: Response, error:any) {
    const body = {
      message: statusMessage(Status.NOT_FOUND),
      error
    };

    jsonResponse(response, body, {
      status: Status.NOT_FOUND,
    });
  },

  unsupportedAction(_: Request, response: Response, error:any) {
    const body = {
      message: statusMessage(Status.UNSUPPORTED_ACTION),
      error
    };

    jsonResponse(response, body, {
      status: Status.UNSUPPORTED_ACTION,
    });
  },

  invalid(_: Request, response: Response, errors:any) {
    const body = {
      message: statusMessage(Status.VALIDATION_FAILED),
      errors,
    };

    jsonResponse(response, body, {
      status: Status.VALIDATION_FAILED,
    });
  },
  serverError(_: Request, response: Response, error:any) {
    let composedErr;
    if (error instanceof Error) {
      composedErr = {
        message: error.message,
        stacktrace: error.stack,
      };
    }
    const body = {
      message: statusMessage(Status.SERVER_ERROR),
      error: composedErr,
    };

    jsonResponse(response, body, {
      status: Status.SERVER_ERROR,
    });
  },

  requireParams(
    request: Request,
    response: Response,
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
      Api.badRequest(request, response, missing);
    } else {
      next();
    }
  },

  requireHeaders(
    request: Request,
    response: Response,
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
      Api.badRequest(request, response, missing);
    } else {
      next();
    }
  },
};

export { Api };
