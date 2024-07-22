import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class GlobalLogger implements NestMiddleware {
  private readonly logger = new Logger(GlobalLogger.name);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Path: [${req.baseUrl}] Method: [${req.method}] Protocol: [${req.protocol}] Timestamp: [${new Date().toISOString()}] IP: [${req.socket.remoteAddress}]`,
    );
    next();
  }
}
