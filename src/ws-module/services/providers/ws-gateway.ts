// import { OnModuleInit } from '@nestjs/common';
// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { MsgType } from 'src/ws-module/dtos/ws-dtos';
// @WebSocketGateway({
//   cors: {
//     origin: process.env.BASE_URL || 'http://localhost:3000',
//   },
// })
// export class Gateway implements OnModuleInit {
//   @WebSocketServer()
//   server: Server;

//   onModuleInit() {
//     this.server.on('connection', (socket) => console.log(socket.id));
//   }

//   @SubscribeMessage('new_message')
//   new_message(@MessageBody() message: MsgType) {
//     this.server.emit('return_message', message);
//   }
// }
