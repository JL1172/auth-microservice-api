import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as os from 'node:os';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  constructor() {
    this.logger = new Logger(LoggerMiddleware.name);
  }
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `(Method: ${req.method}) (Path: ${
        req.baseUrl
      }) (Timestamp: ${new Date().toISOString()}) (IP: ${
        os.networkInterfaces().wlp48s0[0].address
      })`,
    );
    next();
  }
}
