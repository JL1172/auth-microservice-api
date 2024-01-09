import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);
  constructor() {
    this.logger = new Logger(HttpExceptionFilter.name);
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      }),
    );

    response.status(status).json({
      statusCode: status,
      message: exception.getResponse(),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
