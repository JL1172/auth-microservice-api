import { Module } from '@nestjs/common';
import { WsController } from './ws.controller';

@Module({
  imports: [],
  controllers: [WsController],
  providers: [],
})
export class WsModule {}
