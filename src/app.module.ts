import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthenticationModule } from './authentication-module/authentication.module';
@Module({
  imports: [AuthenticationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
