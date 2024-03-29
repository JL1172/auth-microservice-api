import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import * as hpp from 'hpp';
import * as cors from 'cors';
import helmet from 'helmet';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth-module/auth.module';
import { LoggerMiddleware } from './global-middleware/LoggerMiddleware';
import { WsModule } from './ws-module/ws.module';
import { RateLimitMiddleware } from './global-middleware/RateLimitMiddleware';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, WsModule],
  controllers: [AppController, AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware,
        RateLimitMiddleware,
        hpp(),
        cors(),
        helmet.contentSecurityPolicy(),
        helmet.hsts(),
      )
      .forRoutes('*');
  }
}
