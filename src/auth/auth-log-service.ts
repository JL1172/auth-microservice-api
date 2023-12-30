import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { BodyType, EmailValidation, PasswordValidation } from './auth-dto';
import { validateOrReject } from 'class-validator';
import { PrismaService } from 'src/global-providers/prisma-service';
import * as bcrypt from 'bcryptjs';

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

@Injectable()
export class VerifyUserExists implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const result: Promise<[any, any, any]> = await this.prisma.search(
        req.body,
      );
      const user: null | BodyType = result[0];
      if (!user) {
        throw new HttpException(
          'Invalid email or password.',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          console.log('authorized', req.body.password, user.password);
        } else {
          throw new HttpException(
            'Invalid Email or password.',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    } catch (err) {
      throw new HttpException(
        'Invalid Email or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
