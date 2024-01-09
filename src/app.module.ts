import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import * as hpp from 'hpp';
import * as cors from 'cors';
import helmet from 'helmet';
import { RateLimitMiddleware } from './global-middleware/RateLimitMiddleware';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth-module/auth.module';
import { LoggerMiddleware } from './global-middleware/LoggerMiddleware';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RateLimitMiddleware,
        LoggerMiddleware,
        hpp(),
        cors(),
        helmet.contentSecurityPolicy(),
        helmet.hsts(),
      )
      .forRoutes('*');
  }
}
