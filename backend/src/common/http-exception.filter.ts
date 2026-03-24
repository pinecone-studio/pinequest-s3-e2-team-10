import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type RequestWithId = Request & {
  requestId?: string;
};

@Catch()
export class HttpExceptionLoggingFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: 'Unexpected internal server error',
            error: 'Internal Server Error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };

    const message =
      typeof responseBody === 'string'
        ? responseBody
        : responseBody &&
            typeof responseBody === 'object' &&
            'message' in responseBody
          ? responseBody.message
          : 'Unexpected internal server error';

    const errorLog = {
      level: status >= 500 ? 'error' : 'warn',
      requestId: request?.requestId ?? null,
      method: request?.method ?? 'UNKNOWN',
      path: request?.originalUrl ?? 'UNKNOWN',
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      console.error(JSON.stringify(errorLog));
    } else {
      console.warn(JSON.stringify(errorLog));
    }

    response.status(status).json(responseBody);
  }
}
