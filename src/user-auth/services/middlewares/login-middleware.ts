import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/global-providers/prisma-service';
import {
  LoginBodyType,
  UserPayloadTypeJwtReference,
} from 'src/user-auth/dtos/dtos';
import * as validator from 'validator';
import {
  JwtBuilderProvider,
  JwtHolderProvider,
  UserStorageProvider,
} from '../providers/login-providers';
import * as bcrypt from 'bcryptjs';

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
      const keys: string[] = ['username', 'password'];
      const body: LoginBodyType = req.body;
      for (const key of keys) {
        body[key] = this.validator.default.blacklist(
          body[key],
          /[\x00-\x1F\s;'"\\<>]/.source,
        );
        body[key] = this.validator.default.escape(body[key]);
        body[key] = this.validator.default.trim(body[key]);
      }
      next();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class VerifyUserExistsMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user_storage: UserStorageProvider,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const body: LoginBodyType = req.body;
      const isUserValid: UserPayloadTypeJwtReference =
        await this.prisma.findForLogin(body);
      if (isUserValid) {
        this.user_storage.storeUser(isUserValid);
        next();
      } else {
        throw new HttpException(
          'Invalid Email or Password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class CompareUserPassword implements NestMiddleware {
  private readonly bcrypt = bcrypt;
  constructor(
    private readonly user_storage: UserStorageProvider,
    private readonly jwt_builder: JwtBuilderProvider,
    private jwt_housing: JwtHolderProvider,
  ) {
    this.bcrypt = bcrypt;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const body: LoginBodyType = req.body;
      const userInStorage: UserPayloadTypeJwtReference =
        this.user_storage.readUser();
      if (this.bcrypt.compareSync(body.password, userInStorage.password)) {
        const token: string = this.jwt_builder.createJwt(userInStorage);
        this.jwt_housing.storeJwt({ token });
        next();
      } else {
        throw new HttpException(
          'Invalid Email or Password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
