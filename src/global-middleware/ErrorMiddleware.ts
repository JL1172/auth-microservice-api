import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
  catch(
    error: any,
    res: Response,
    req: Request, /*eslint-disable-line*/
    next: NextFunction /*eslint-disable-line*/,
  ) {
    res.status(error.status || 500).json({
      message: error.message || 'Error message: 500',
      stack: error.stack,
    });
  }
}
