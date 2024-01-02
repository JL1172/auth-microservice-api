import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { LoginBodyType } from 'src/user-auth/dtos/dtos';
import * as validator from 'validator';

@Injectable()
export class LoginBodyValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const results = plainToClass(LoginBodyType, req.body);
    try {
      await validateOrReject(results, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      next();
    } catch (err) {
      const map = new Map();
      err.forEach((n) => map.set(n.property, n.constraints));
      const filtered_results = Object.fromEntries(map);
      throw new HttpException(
        filtered_results,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}

@Injectable()
export class LoginBodySanitationMiddleware implements NestMiddleware {
  private readonly validator = validator;
  constructor() {
    this.validator = validator;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const keys: string[] = ['email', 'password'];
      const body: any = req.body;
      for (const key of keys) {
        body[key] = this.validator.default.blacklist(
          body[key],
          /[\x00-\x1F\s;'"\\<>]/.source,
        );
        body[key] = this.validator.default.escape(body[key]);
        body[key] = this.validator.default.trim(body[key]);
      }
      body.email = this.validator.default.normalizeEmail(body.email);
      next();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
