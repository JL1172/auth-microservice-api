import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationErrorHandler } from './providers/error';
import {
  RegisterRateLimiter,
  ValidateRegisterBody,
} from './middleware/register';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [AuthenticationErrorHandler],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RegisterRateLimiter, ValidateRegisterBody)
      .forRoutes('/auth/register');
  }
}
