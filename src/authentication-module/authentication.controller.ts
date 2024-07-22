import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthenticationController {
  @Get('/auth-health-check')
  public healthCheck(): string {
    return 'health check verified';
  }
}
