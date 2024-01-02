import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RegisterBodyType, UserPayloadTypeJwtReference } from '../../dtos/dtos';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as validator from 'validator';
import { PrismaService } from 'src/global-providers/prisma-service';
import { PasswordHashProvider } from '../providers/registration-providers';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BodyValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const result: RegisterBodyType = plainToClass(RegisterBodyType, req.body);
    try {
      await validateOrReject(result, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      next();
    } catch (err) {
      const map: Map<string, string> = new Map();
      err.forEach((n): void => {
        map.set(n.property, n.constraints);
      });
      const errors: { [key: string]: string } = Object.fromEntries(map);
      throw new HttpException(errors, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}

@Injectable()
export class BodySanitationMiddleware implements NestMiddleware {
  private readonly validator = validator;
  constructor() {
    this.validator = validator;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const body: any = req.body;
      const keys: string[] = ['email', 'first_name', 'last_name', 'password'];
      keys.forEach((n): void => {
        body[n] = this.validator.default.trim(body[n]);
        body[n] = this.validator.default.escape(body[n]);
        body[n] = this.validator.default.blacklist(
          body[n],
          /[\x00-\x1F\s;'"\\<>]/.source,
        );
      });
      body.email = this.validator.default.normalizeEmail(body.email);
      next();
    } catch (err) {
      throw new HttpException(
        `Error sanitizing data:${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Injectable()
export class VerfiyUniqueUserMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(
    req: Request,
    res: Response /*eslint-disable-line */,
    next: NextFunction /*eslint-disable-line */,
  ) {
    try {
      const result: Promise<UserPayloadTypeJwtReference[]> =
        await this.prisma.find(req.body);
      if (result[0]) {
        throw new HttpException(
          'Account Already Exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (
          result[1] &&
          result[1].first_name === req.body.first_name &&
          result[1].last_name === req.body.last_name
        ) {
          throw new HttpException(
            'Account Already Exists',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          next();
        }
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class PasswordHasher implements NestMiddleware {
  constructor(private passwordProvider: PasswordHashProvider) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const body: RegisterBodyType = req.body;
      const hashedPassword: string = bcrypt.hashSync(
        body.password,
        Number(process.env.BCRYPT_ROUNDS),
      );
      this.passwordProvider.storePassword(hashedPassword);
      next();
    } catch (err) {
      throw new HttpException(
        `Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
