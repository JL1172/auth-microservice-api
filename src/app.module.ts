import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthenticationModule } from './authentication-module/authentication.module';
import { GlobalLogger } from './global/middleware/logger';
@Module({
  imports: [AuthenticationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalLogger).forRoutes('*');
  }
}
