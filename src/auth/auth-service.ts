import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/global-providers/prisma-service';
import {
  EmailValidation,
  FirstNameValidation,
  LastNameValidation,
  PasswordValidation,
} from './auth-dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class RegisterService implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { first_name, last_name, email, password } = req.body;
    const result: EmailValidation = plainToClass(EmailValidation, { email });
    const result2: FirstNameValidation = plainToClass(FirstNameValidation, {
      first_name,
    });
    const result3: PasswordValidation = plainToClass(PasswordValidation, {
      password,
    });
    const result4: LastNameValidation = plainToClass(LastNameValidation, {
      last_name,
    });
    const validator = async (stat: any): Promise<void | boolean> => {
      try {
        await validateOrReject(stat, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
        return true;
      } catch (err) {
        console.log(err[0]);
        throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    };
    const result_list = [result, result2, result3, result4];
    for (const reslt of result_list) {
      const bool: any = validator(reslt);
      if (!bool) {
        break;
      }
    }
    next();
  }
}
