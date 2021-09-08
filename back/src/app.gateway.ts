import { Logger, UseFilters } from '@nestjs/common';
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
import { User } from './users/entities/user.entity';
import { WebsocketExceptionFilter } from './filters/websocket-exception.filter';
import { ChatRoom } from './chat/entities/chat-room.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from './chat/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@UseFilters(WebsocketExceptionFilter)
@WebSocketGateway(8001)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private chatService: ChatService,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log(`Socket Server Initialized`);
  }

  handleConnection(client: Socket) {
    const jwtDecoded = this.jwtService.verify(client.handshake.auth.token);
    this.logger.log(`Client ${jwtDecoded.username} Connected`);
  }

  handleDisconnect(client: Socket) {
    const jwtDecoded = this.jwtService.verify(client.handshake.auth.token);
    this.logger.log(`Client ${jwtDecoded.username} Disconnected`);
  }

  @SubscribeMessage('join')
  async joinChatRoom(client: Socket, payload: { chatIndex: number }) {
    const user = await this.validateChatUser(
      client.handshake.auth.token,
      payload.chatIndex,
    );
    client.join(String(payload.chatIndex));
    client.emit('joined', { status: 'SUCCESS' });
    this.logger.log(
      `Client ${user.username} joined to chat ${payload.chatIndex}`,
    );
  }

  @SubscribeMessage('leave')
  async leaveChatRoom(client: Socket, payload: { chatIndex: number }) {
    const user = await this.validateChatUser(
      client.handshake.auth.token,
      payload.chatIndex,
    );
    client.leave(String(payload.chatIndex));
    client.emit('left', { status: 'SUCCESS' });
    this.logger.log(`Client ${user.username} left chat ${payload.chatIndex}`);
  }

  @SubscribeMessage('onMessage')
  async onMessage(
    client: Socket,
    payload: { chatIndex: number; message: string },
  ) {
    const roomName = String(payload.chatIndex);
    const user = await this.validateChatUser(
      client.handshake.auth.token,
      payload.chatIndex,
    );

    const clients = this.server.sockets.adapter.rooms.get(roomName);
    if (!clients || !clients.has(client.id))
      throw new WsException('User Not Joined in the Chat Socket');

    const message = new Message();
    message.chatRoom = await this.chatService.getChat(payload.chatIndex);
    message.sendUser = user;
    message.messageContent = payload.message;
    this.messageRepository.save(message);

    client.to(roomName).emit('onMessage', payload.message);
  }

  getUserByJwt(jwtToken: string): Promise<User> {
    const jwtDecode = this.jwtService.verify(jwtToken);
    return this.usersService.getUser(jwtDecode.username);
  }

  async validateChatUser(token: string, chatIndex: number): Promise<User> {
    let user: User;
    let chat: ChatRoom;

    try {
      user = await this.getUserByJwt(token);
    } catch (e) {
      if (e instanceof EntityNotFoundError)
        throw new WsException('User Not Found');
      else throw e;
    }

    try {
      chat = await this.chatService.getChat(chatIndex);
    } catch (e) {
      if (e instanceof EntityNotFoundError)
        throw new WsException('Chat Not Found');
      else throw e;
    }

    if (
      !chat.joinUsers.find((joinUser) => {
        if (joinUser.index === user.index) return true;
      })
    )
      throw new WsException('User Not Joined in the Chat');

    return user;
  }
}
