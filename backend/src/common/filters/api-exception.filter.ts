import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpErrorResponseBody {
  error?: string;
  message?: string | string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function normalizeHttpResponseBody(value: unknown): HttpErrorResponseBody {
  if (typeof value === 'string') {
    return { message: value };
  }

  if (!isRecord(value)) {
    return { message: 'Unexpected error' };
  }

  const { error, message } = value;

  return {
    error: typeof error === 'string' ? error : undefined,
    message:
      typeof message === 'string' || Array.isArray(message)
        ? message
        : 'Unexpected error',
  };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', statusCode: 500 };
    const normalizedBody = normalizeHttpResponseBody(responseBody);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: normalizedBody.error,
      message: normalizedBody.message,
    };

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(`${request.method} ${request.url} ${status}`, stack);
    } else {
      this.logger.warn(`${request.method} ${request.url} ${status}`);
    }

    response.status(status).json(errorResponse);
  }
}
