import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ErrorMiddleware } from './global-providers/error-middleware';
import { AuthenticationController } from './auth/auth-controller';
import { RegisterService } from './auth/auth-service';
import { PrismaService } from './global-providers/prisma-service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticationController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorMiddleware).forRoutes('*');
    consumer.apply(RegisterService).forRoutes('auth/register');
  }
}
