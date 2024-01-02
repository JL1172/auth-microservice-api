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
  VerfiyUniqueUserMiddleware,
} from './user-auth/services/registration-middleware';
import { PrismaService } from './global-providers/prisma-service';

@Module({
  imports: [],
  controllers: [AppController, UserAuthController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ErrorMiddleware, RateLimitMiddleware, hpp(), cors(), helmet())
      .forRoutes('*');
    consumer
      .apply(
        BodyValidationMiddleware,
        BodySanitationMiddleware,
        VerfiyUniqueUserMiddleware,
      )
      .forRoutes('/api/auth/register');
  }
}
