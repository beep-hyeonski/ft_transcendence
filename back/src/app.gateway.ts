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
import { Chat } from './chat/entities/chat.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from './chat/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMatchDto } from './match/dto/create-match.dto';
import { MatchService } from './match/match.service';
import { v1 } from 'uuid';
import { GameService, BallSpeed, Game, KeyState } from './game/game.service';
import { Interval } from '@nestjs/schedule';
@UseFilters(WebsocketExceptionFilter)
@WebSocketGateway(8001, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private chatService: ChatService,
    private matchService: MatchService,
    private gameService: GameService,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}
  @WebSocketServer()
  server: Server;
  wsClients: Map<number, Socket> = new Map<number, Socket>();
  gameQueue: Array<Socket> = [];
  private logger: Logger = new Logger('AppGateway');
  afterInit() {
    this.gameService.attachServer(this.server);
    this.logger.log(`Socket Server Initialized`);
  }
  handleConnection(client: Socket) {
    const jwtDecoded = this.jwtService.verify(
      client.handshake.headers.authorization,
    );
    if (this.wsClients.has(jwtDecoded.sub)) {
      client.emit('exception', {
        status: 'error',
        message: 'Already Connected User',
      });
      client.disconnect();
      return;
    }
    this.wsClients.set(jwtDecoded.sub, client);
    this.logger.log(`Client ${jwtDecoded.username} Connected`);
  }
  handleDisconnect(client: Socket) {
    const jwtDecoded = this.jwtService.verify(
      client.handshake.headers.authorization,
    );
    const isExistsInQueue = this.gameQueue.findIndex((inQueueClient) => (
      inQueueClient.id === client.id
    ));
    if (isExistsInQueue !== -1) {
      this.gameQueue.splice(isExistsInQueue, 1);
    }
    this.wsClients.delete(jwtDecoded.sub);
    this.logger.log(`Client ${jwtDecoded.username} Disconnected`);
  }
  @SubscribeMessage('join')
  async joinChat(client: Socket, payload: { chatIndex: number }) {
    const user = await this.validateChatUser(
      client.handshake.headers.authorization,
      payload.chatIndex,
    );
    if (user.bannedChannels.find((chat) => chat.index === payload.chatIndex))
      throw new WsException('User has been banned from the chat');
    client.join(String(payload.chatIndex));
    client.emit('joined', { status: 'SUCCESS' });
    this.logger.log(
      `Client ${user.username} joined to chat ${payload.chatIndex}`,
    );
  }
  @SubscribeMessage('leave')
  async leaveChat(client: Socket, payload: { chatIndex: number }) {
    const user = await this.validateChatUser(
      client.handshake.headers.authorization,
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
      client.handshake.headers.authorization,
      payload.chatIndex,
    );
    const clients = this.server.sockets.adapter.rooms.get(roomName);
    if (!clients || !clients.has(client.id))
      throw new WsException('User Not Joined in the Chat Socket');
    if (!user.mutedChannels.find((chat) => chat.index !== payload.chatIndex)) {
      const message = new Message();
      message.chat = await this.chatService.getChat(payload.chatIndex);
      message.sendUser = user;
      message.messageContent = payload.message;
      this.messageRepository.save(message);
      client.to(roomName).emit('onMessage', {
        sender: user.username,
        message: payload.message,
      });
    } else {
      throw new WsException('User has been muted from this chat');
    }
  }
  @SubscribeMessage('matchQueue')
  async onMatchQueue(client: Socket) {
    const isExistsInQueue = this.gameQueue.findIndex((inQueueClient) => (
      inQueueClient.id === client.id
    ));
    if (isExistsInQueue !== -1) {
      this.gameQueue.splice(isExistsInQueue, 1);
      this.logger.log('Duplicate Queue Request');
    }
    this.gameQueue.push(client);
    if (this.gameQueue.length >= 2) {
      const gameName = String(`game_${v1()}`);
      const player1 = await this.getUserByJwt(
        this.gameQueue[0].handshake.headers.authorization,
      );
      const player2 = await this.getUserByJwt(
        this.gameQueue[1].handshake.headers.authorization,
      );
      this.gameQueue[0].join(gameName);
      this.gameQueue[1].join(gameName);
      this.gameQueue = this.gameQueue.slice(2);
      const game: Game = this.gameService.gameSet(
        gameName,
        player1,
        player2,
        BallSpeed.NORMAL,
      );
      this.server.to(gameName).emit('matchComplete', {
        status: 'GAME_START',
        gameName: gameName,
        frameInfo: game.frameInfo,
        gameInfo: game.gameInfo,
        player1Info: game.playerInfo[0],
        player2Info: game.playerInfo[1],
        ballInfo: game.ballInfo,
      });
      this.logger.log(gameName);
    }
  }
  @SubscribeMessage('sendKeyEvent')
  onKeyEvent(
    client: Socket,
    payload: { sender: string; gameName: string; keyState: KeyState },
  ) {
    this.gameService.applyEvent(
      payload.gameName,
      payload.sender,
      payload.keyState,
    );
  }
  @SubscribeMessage('matchResult')
  async matchResult(
    client: Socket,
    payload: { gameName: string; createMatchDto: CreateMatchDto },
  ) {
    this.gameService.closeGame(payload.gameName);
    this.matchService.createMatch(payload.createMatchDto);
    this.logger.log('game End');
    this.server.to(payload.gameName).emit('endGame', {
      status: 'GAME_END',
    });
    this.server.socketsLeave(payload.gameName);
  }
  @SubscribeMessage('matchRequest')
  async onMatchRequest(
    client: Socket,
    payload: { receiveUserIndex: number; ballSpeed: 'NORMAL' | 'FAST' },
  ) {
    const sender = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );
    const gameName = String(`game_${v1()}`);
    client.join(gameName);
    this.wsClients.get(payload.receiveUserIndex).emit('matchRequest', {
      status: 'REQUEST_MATCH',
      sendUserIndex: sender.index,
      gameName: gameName,
      ballSpeed: payload.ballSpeed,
    });
  }
  @SubscribeMessage('matchResponse')
  async onMatchAccepted(
    client: Socket,
    payload: {
      status: string;
      gameName: string;
      sendUserIndex: number;
      ballSpeed: 'NORMAL' | 'FAST';
    },
  ) {
    switch (payload.status) {
      case 'ACCEPT':
        const clients = this.server.sockets.adapter.rooms.has(payload.gameName);
        if (!clients) throw new WsException('Bad Request');
        const player1 = await this.getUserByJwt(
          this.wsClients.get(payload.sendUserIndex).handshake.headers
            .authorization,
        );
        const player2 = await this.getUserByJwt(
          client.handshake.headers.authorization,
        );
        client.join(payload.gameName);
        const game: Game = this.gameService.gameSet(
          payload.gameName,
          player1,
          player2,
          BallSpeed.NORMAL,
        );
        this.server.to(payload.gameName).emit('matchComplete', {
          status: 'GAME_START',
          gameName: payload.gameName,
          frameInfo: game.frameInfo,
          gameInfo: game.gameInfo,
          player1Info: game.playerInfo[0],
          player2Info: game.playerInfo[1],
          ballInfo: game.ballInfo,
        });
        break;
      case 'REJECT':
        this.server.socketsLeave(payload.gameName);
        this.wsClients.get(payload.sendUserIndex).emit('matchReject', {
          status: 'MATCH_REJECT',
        });
        break;
      default:
        throw new WsException('Bad Request');
    }
  }
  @SubscribeMessage('observeMatch')
  observeMatch(client: Socket, payload: { matchInUserIndex: number }) {
    let gameName = '';
    this.wsClients.get(payload.matchInUserIndex).rooms.forEach((room) => {
      if (room.indexOf('game_') !== -1) gameName = room;
    });
    if (gameName === '') {
      throw new WsException('Not in Game');
    }
    const game = this.gameService.getGame(gameName);
    client.emit('matchComplete', {
      status: 'GAME_START',
      gameName: gameName,
      frameInfo: game.frameInfo,
      gameInfo: game.gameInfo,
      player1Info: game.playerInfo[0],
      player2Info: game.playerInfo[1],
      ballInfo: game.ballInfo,
    });
    client.join(gameName);
  }
  async getUserByJwt(jwtToken: string): Promise<User> {
    const jwtDecode = this.jwtService.verify(jwtToken);
    return await this.usersService.getUser(jwtDecode.username);
  }
  async validateChatUser(token: string, chatIndex: number): Promise<User> {
    let user: User;
    let chat: Chat;
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
    if (!chat.joinUsers.find((joinUser) => joinUser.index === user.index))
      throw new WsException('User Not Joined in the Chat');
    return user;
  }
}