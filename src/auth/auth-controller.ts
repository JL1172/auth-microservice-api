import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BodyType } from './auth-dto';

@Controller('auth')
export class AuthenticationController {
  constructor() {}
  @Get('sanity')
  sanity(@Res({ passthrough: true }) res: Response): any {
    res.status(200).json({ message: 'hello world' });
  }
  @Post('/register')
  register(
    @Body() body: BodyType,
    @Res({ passthrough: true }) res: Response,
  ): any {
    return 'hello';
  }
}
