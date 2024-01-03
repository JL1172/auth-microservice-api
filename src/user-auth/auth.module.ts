import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/global-providers/prisma-service';
import {
  CreateUserContainerProvider,
  PasswordHashProvider,
} from './services/providers/registration-providers';
import {
  JwtBuilderProvider,
  JwtHolderProvider,
  UserStorageProvider,
} from './services/providers/login-providers';
import {
  DecodedJwtHolder,
  FinalizedPayloadProvider,
} from './services/providers/logout-provider';
import { QueryExpiredToken } from 'src/cron/sql-query-job';
import { UserAuthController } from './user-auth.controller';
import {
  BodySanitationMiddleware,
  BodyValidationMiddleware,
  PasswordHasher,
  VerfiyUniqueUserMiddleware,
} from './services/middlewares/registration-middleware';
import {
  CompareUserPassword,
  LoginBodySanitationMiddleware,
  LoginBodyValidationMiddleware,
  VerifyUserExistsMiddleware,
} from './services/middlewares/login-middleware';
import {
  BlacklistTokenMiddleware,
  LogoutSanitationMiddleware,
  LogoutValidationMiddleware,
  TokenScannerMiddleware,
  VerifyTokenUnique,
} from './services/middlewares/logout-middleware';

@Module({
  controllers: [UserAuthController],
  providers: [
    PrismaService,
    PasswordHashProvider,
    CreateUserContainerProvider,
    UserStorageProvider,
    JwtBuilderProvider,
    JwtHolderProvider,
    DecodedJwtHolder,
    FinalizedPayloadProvider,
    QueryExpiredToken,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
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
