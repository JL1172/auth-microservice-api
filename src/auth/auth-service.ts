import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/global-providers/prisma-service';
import {
  BodyType,
  EmailValidation,
  FirstNameValidation,
  LastNameValidation,
  PasswordValidation,
} from './auth-dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterService implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { first_name, last_name, email, password } = req.body;
    const result = plainToClass(EmailValidation, { email });
    const result2: FirstNameValidation = plainToClass(FirstNameValidation, {
      first_name,
    });
    const result3: PasswordValidation = plainToClass(PasswordValidation, {
      password,
    });
    const result4: LastNameValidation = plainToClass(LastNameValidation, {
      last_name,
    });
    async function error_handler(result_value: any): Promise<any> {
      try {
        await validateOrReject(result_value, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
      } catch (errors) {
        const error: string =
          errors[0].constraints.isEmail || errors[0].constraints.isNotEmpty;
        throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    const result_values: any[] = [result, result2, result3, result4];
    for (const list of result_values) await error_handler(list);
    next();
  }
}

@Injectable()
export class ValidateUnique implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const result: Promise<BodyType | null> = await this.prisma.search(
        req.body,
      );
      const bool: boolean = result[1] && result[2];
      if (result[0] === null && !bool) {
        next();
      } else {
        throw new HttpException(
          'Account already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } catch (err) {
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }
  }
}

@Injectable()
export class UserProcesser {
  private readonly processed_user: BodyType[] = [];
  constructor(private readonly prisma: PrismaService) {}
  preparedUser(user: BodyType): void {
    const hashed: string = bcrypt.hashSync(
      user.password,
      Number(process.env.BCRYPT_ROUNDS),
    );
    user.password = hashed;
    this.processed_user.push(user);
  }
  async addUser(): Promise<BodyType> {
    return this.prisma.add_user(this.processed_user[0]);
  }
}
