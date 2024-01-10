import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'My Sanity Check(1)';
  }
  @Get('sanity')
  sanity(): string {
    return 'My Sanity Check(2)';
  }
}
