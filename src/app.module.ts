import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ErrorMiddleware } from './global-providers/error-middleware';
import { AuthenticationController } from './auth/auth-controller';
import {
  RegisterService,
  UserProcesser,
  ValidateUnique,
} from './auth/auth-reg-service';
import { PrismaService } from './global-providers/prisma-service';
import {
  LoginBodyVerification,
  VerifyUserExists,
} from './auth/auth-log-service';
import { TokenService } from './auth/token-service';
import { Token_Bundler } from './auth/token-bunder-service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticationController],
  providers: [PrismaService, UserProcesser, TokenService, Token_Bundler],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorMiddleware).forRoutes('*');
    consumer.apply(RegisterService, ValidateUnique).forRoutes('auth/register');
    consumer
      .apply(LoginBodyVerification, VerifyUserExists)
      .forRoutes('auth/login');
  }
}
