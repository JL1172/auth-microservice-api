import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthenticationController {
  @Get('/health-check')
  public healthCheck(): string {
    return 'health check verified';
  }
  @Post('/register')
  public register(): string {
    return 'register endpoint';
  }
}
