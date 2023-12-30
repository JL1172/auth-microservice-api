import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
  catch(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction /*eslint-disable-line */,
  ): any {
    res.status(error.status || 500).json({
      message: error.message,
      stack: error.stack,
    });
  }
}
