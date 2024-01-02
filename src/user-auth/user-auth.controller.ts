import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginBodyType, RegisterBodyType } from './dtos/dtos';
import {
  CreateUserContainerProvider,
  PasswordHashProvider,
} from './services/providers/registration-providers';
import { Response } from 'express';

@Controller('api/auth')
export class UserAuthController {
  constructor(
    private readonly third_party_create: CreateUserContainerProvider,
    private readonly passwordStorage: PasswordHashProvider,
  ) {}
  @Post('register')
  async register(
    @Body() body: RegisterBodyType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    body.password = this.passwordStorage.readPassword();
    const result: Promise<string> =
      await this.third_party_create.add_user_to_db(body);
    res.status(201).json({ message: 'Succesfully created user', data: result });
  }
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginBodyType,
  ): Promise<string> {
    return 'login';
  }
}
