import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginBodyType, RegisterBodyType } from './dtos';

@Controller('api/auth')
export class UserAuthController {
  constructor() {}
  @Post('register')
  async register(
    @Body() body: RegisterBodyType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    return 'hello world from register';
  }
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginBodyType,
  ): Promise<string> {
    return 'hello world from login';
  }
}
