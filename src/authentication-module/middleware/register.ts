//rate limit
//validate ip (later)
//validate body
//sanitize
//validate user is unique

import { HttpStatus, Injectable, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as rateLimit from 'express-rate-limit';
import { AuthenticationErrorHandler } from '../providers/error';

@Injectable()
export class RegisterRateLimiter implements NestMiddleware {
  constructor(private readonly error: AuthenticationErrorHandler) {}
  private readonly ratelimit = rateLimit.rateLimit({
    windowMs: 1000 * 15 * 60,
    limit: 15, //this might be too generous but can reeval
    handler: () => {
      this.error.reportHttpError(
        'Too Many Registration Attempts.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    },
  });
  use(req: Request, res: Response, next: NextFunction) {
    this.ratelimit(req, res, next);
  }
}


