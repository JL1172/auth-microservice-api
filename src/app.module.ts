import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ErrorMiddleware } from './global-middleware/ErrorMiddleware';
import { UserAuthController } from './user-auth/user-auth.controller';
import * as hpp from 'hpp';
import * as cors from 'cors';
import helmet from 'helmet';
import { RateLimitMiddleware } from './global-middleware/RateLimitMiddleware';
import {
  BodySanitationMiddleware,
  BodyValidationMiddleware,
  PasswordHasher,
  VerfiyUniqueUserMiddleware,
} from './user-auth/services/middlewares/registration-middleware';
import { PrismaService } from './global-providers/prisma-service';
import {
  CreateUserContainerProvider,
  PasswordHashProvider,
} from './user-auth/services/providers/registration-providers';
import {
  CompareUserPassword,
  LoginBodySanitationMiddleware,
  LoginBodyValidationMiddleware,
  VerifyUserExistsMiddleware,
} from './user-auth/services/middlewares/login-middleware';
import {
  JwtBuilderProvider,
  JwtHolderProvider,
  UserStorageProvider,
} from './user-auth/services/providers/login-providers';
import {
  BlacklistTokenMiddleware,
  LogoutSanitationMiddleware,
  LogoutValidationMiddleware,
  TokenScannerMiddleware,
  VerifyTokenUnique,
} from './user-auth/services/middlewares/logout-middleware';
import {
  DecodedJwtHolder,
  FinalizedPayloadProvider,
} from './user-auth/services/providers/logout-provider';

@Module({
  imports: [],
  controllers: [AppController, UserAuthController],
  providers: [
    PrismaService,
    PasswordHashProvider,
    CreateUserContainerProvider,
    UserStorageProvider,
    JwtBuilderProvider,
    JwtHolderProvider,
    DecodedJwtHolder,
    FinalizedPayloadProvider,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ErrorMiddleware,
        RateLimitMiddleware,
        hpp(),
        cors(),
        helmet.contentSecurityPolicy(),
        helmet.hsts(),
      )
      .forRoutes('*');
    consumer
      .apply(
        BodyValidationMiddleware,
        BodySanitationMiddleware,
        VerfiyUniqueUserMiddleware,
        PasswordHasher,
      )
      .forRoutes('/api/auth/register');
    consumer
      .apply(
        LoginBodyValidationMiddleware,
        LoginBodySanitationMiddleware,
        VerifyUserExistsMiddleware,
        CompareUserPassword,
      )
      .forRoutes('/api/auth/login');
    consumer
      .apply(
        LogoutValidationMiddleware,
        LogoutSanitationMiddleware,
        VerifyTokenUnique,
        TokenScannerMiddleware,
        BlacklistTokenMiddleware,
      )
      .forRoutes('/api/auth/logout');
  }
}
