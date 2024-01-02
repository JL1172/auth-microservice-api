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

@Module({
  imports: [],
  controllers: [AppController, UserAuthController],
  providers: [PrismaService, PasswordHashProvider, CreateUserContainerProvider],
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
        helmet(),
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
  }
}
