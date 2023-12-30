import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { EmailValidation, PasswordValidation } from './auth-dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class LoginBodyVerification implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: Response, next: NextFunction) {
    const result = plainToClass(EmailValidation, { email: req.body.email });
    const result2 = plainToClass(PasswordValidation, {
      password: req.body.password,
    });
    for (const result_value of [result, result2]) {
      try {
        await validateOrReject(result_value, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
      } catch (err) {
        throw new HttpException(
          err[0].constraints.isEmail || err[0].constraints.isNotEmpty,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    next();
  }
}
