import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'ws';

@WebSocketGateway(5000, {
  namespace: 'ChatSocket'
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {

  }

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log(`Socket Server Connected...`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Chat Socket Gateway handleConnection');
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Chat Socket Gateway handleDisconnect');
  }

  @SubscribeMessage('join')
  joinChatRoom(client: any, payload: any): string {
    return 'join Chat Room';
  }

  @SubscribeMessage('leave')
  leaveChatRoom(client: any, payload: any): string {
    return 'leave Chat Room';
  }

  @SubscribeMessage('onMessage')
  onMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

}
