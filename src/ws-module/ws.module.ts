import { Module } from '@nestjs/common';
import { WsController } from './ws.controller';
import { Gateway } from './services/providers/ws-gateway';

@Module({
  imports: [],
  controllers: [WsController],
  providers: [Gateway],
})
export class WsModule {}
