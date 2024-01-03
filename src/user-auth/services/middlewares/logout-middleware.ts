import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as validator from 'validator';
import { JwtHolderProvider } from '../providers/login-providers';
import * as jwt from 'jsonwebtoken';
import {
  InstanceOfTokenExpType,
  JwtDecodedType,
} from 'src/user-auth/dtos/dtos';
import {
  DecodedJwtHolder,
  FinalizedPayloadProvider,
} from '../providers/logout-provider';
import { PrismaService } from 'src/global-providers/prisma-service';
@Injectable()
export class LogoutValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.headers.authorization;
      if (!token) {
        throw new HttpException(
          'Token Required',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        next();
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class LogoutSanitationMiddleware implements NestMiddleware {
  private readonly validator: typeof validator = validator;
  constructor(private readonly jwt_housing: JwtHolderProvider) {
    this.validator = validator;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token: string = req.headers.authorization;
      token = this.validator.default.escape(token);
      token = this.validator.default.trim(token);
      token = this.validator.default.blacklist(
        token,
        /[\x00-\x1F\s;'"\\<>]/.source,
      );
      this.jwt_housing.storeJwt({ token });
      next();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class VerifyTokenUnique implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt_housing: JwtHolderProvider,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.prisma.findJwt({
        token: this.jwt_housing.readJwt().at(0).token,
      });
      if (result) {
        throw new HttpException(
          'Invalid Entry: No Duplicate Entries',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        next();
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
@Injectable()
export class TokenScannerMiddleware implements NestMiddleware {
  private readonly jwt = jwt;
  constructor(
    private readonly jwt_housing: JwtHolderProvider,
    private readonly decoded_token: DecodedJwtHolder,
  ) {
    this.jwt = jwt;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token: any = this.jwt_housing.readJwt().at(0).token;
      if (token) {
        this.jwt.verify(
          token,
          process.env.JWT_SECRET,
          (err, decodedToken: JwtDecodedType) => {
            if (err) {
              throw new HttpException(
                `Invalid Token Error: ${err}`,
                HttpStatus.UNAUTHORIZED,
              );
            } else {
              this.decoded_token.store_decoded_token(decodedToken);
              next();
            }
          },
        );
      } else {
        throw new HttpException(
          'Token Required',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class BlacklistTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly decoded_housing: DecodedJwtHolder,
    private readonly prisma: PrismaService,
    private readonly jwt_housing: JwtHolderProvider,
    private readonly finalized_payload: FinalizedPayloadProvider,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token_decoded: JwtDecodedType[] =
        this.decoded_housing.read_decoded_token();
      const value_to_insert: Date = new Date(token_decoded[0].exp * 1000);
      this.finalized_payload.store_token({
        token: this.jwt_housing.readJwt().at(0).token,
        expiration_time: value_to_insert,
      });
      next();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
