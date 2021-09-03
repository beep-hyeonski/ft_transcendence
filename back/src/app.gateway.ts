import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat/chat.service';
import { UsersService } from './users/users.service';
import { EntityNotFoundError } from 'typeorm';
import { User } from './users/entities/user.entity';

@WebSocketGateway(8001)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private chatService: ChatService,
  ) {

  }

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log(`Socket Server Connected...`);
  }

  handleConnection(client: Socket) {
    this.jwtService.verify(client.handshake.auth.token);

  }

  handleDisconnect(client: Socket) {
    console.log(client);
    this.logger.log('Chat Socket Gateway handleDisconnect');
  }

  @SubscribeMessage('join')
  async joinChatRoom(client: Socket, payload: { chatIndex: number }) {
    // DB Chat validation
    // 1. Chat 존재 여부
    // 2. 이미 join ?
    
    try {
      const user = await this.getUserByJwt(client.handshake.auth.token);
      const chat = await this.chatService.getChat(payload.chatIndex);
      if (!chat.joinUsers.find((joinUser) => {
        if (joinUser.index === user.index) {
          return true;
        }
      })) {
        throw new WsException('User Not Joined in the Chat');
      }
      client.join(String(payload.chatIndex));
      client.emit('joined', { status: "SUCCESS" })
    } catch (e) {
      if (e instanceof EntityNotFoundError)
        throw new WsException('Not Found');
      else
        throw e;
    }
  }

  @SubscribeMessage('leave')
  leaveChatRoom(client: Socket, payload: any) {
    // chatIndex 받기
    // client.leave(room)
    // socket api -> url api
    return 'leave Chat Room';
  }

  @SubscribeMessage('onMessage')
  onMessage(client: Socket, payload: any) {
    // chatIndex 받기
    // this.server.to(room).emit(refresh)
    return 'Hello world!';
  }

  getUserByJwt(jwtToken: string): Promise<User> {
    const jwtDecode = this.jwtService.verify(jwtToken);
    return this.usersService.getUser(jwtDecode.username);
  }
}
