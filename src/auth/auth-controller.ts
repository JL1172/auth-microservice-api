import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BodyType, LoginType } from './auth-dto';
import { UserProcesser } from './auth-reg-service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly user_functions: UserProcesser) {}
  @Get('sanity')
  sanity(@Res({ passthrough: true }) res: Response): any {
    res.status(200).json({ message: 'hello world' });
  }
  @Post('/register')
  async register(
    @Body() body: BodyType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.user_functions.preparedUser(body);
    const result = await this.user_functions.addUser();
    res.status(201).json(result);
  }
  @Post('/login')
  async login(
    @Body() body: LoginType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    console.log('login endpoint');
  }
}
