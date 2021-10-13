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
import { User, UserStatus } from './users/entities/user.entity';
import {
  WebsocketExceptionFilter,
  WsChatException,
  WsGameException,
} from './filters/websocket-exception.filter';
import { Chat } from './chat/entities/chat.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from './chat/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMatchDto } from './match/dto/create-match.dto';
import { MatchService } from './match/match.service';
import { v1 } from 'uuid';
import { GameService, BallSpeed, Game, KeyState } from './game/game.service';
import { DM } from './dm/entities/dm.entity';

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
    @InjectRepository(DM) private dmRepository: Repository<DM>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  wsClients: Map<number, Socket> = new Map<number, Socket>();
  gameQueue: Array<Socket> = [];
  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.gameService.attachServer(this.server);
    this.chatService.attachServer(this.server);
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
      this.usersService.statusChange(jwtDecoded.sub, 'ONLINE');
      this.logger.log(`Client ${jwtDecoded.username} Connected`);
  }

  handleDisconnect(client: Socket) {
    const jwtDecoded = this.jwtService.verify(
      client.handshake.headers.authorization,
    );
    const isExistsInQueue = this.gameQueue.findIndex(
      (inQueueClient) => inQueueClient.id === client.id,
    );
    if (isExistsInQueue !== -1) {
      this.gameQueue.splice(isExistsInQueue, 1);
    }
    this.wsClients.delete(jwtDecoded.sub);
    this.usersService.statusChange(jwtDecoded.sub, 'OFFLINE').catch(() => {
      throw new WsException('User Not Found');
    });;
    this.logger.log(`Client ${jwtDecoded.username} Disconnected`);
  }

  @SubscribeMessage('join')
  async joinChat(client: Socket, payload: { chatIndex: number }) {
    const user = await this.validateChatUser(
      client.handshake.headers.authorization,
      payload.chatIndex,
    );
    if (user.isBanned) throw new WsException('User is banned');

    if (
      user.bannedChannels &&
      user.bannedChannels.find((chat) => chat.index === payload.chatIndex)
    )
      throw new WsChatException('User has been banned from the chat');

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
    // Ban도 같이 처리되고 있음
    const user = await this.validateChatUser(
      client.handshake.headers.authorization,
      payload.chatIndex,
    );
    if (user.isBanned) throw new WsException('User is banned');

    const clients = this.server.sockets.adapter.rooms.get(roomName);
    if (!clients || !clients.has(client.id))
      throw new WsChatException('User Not Joined in the Chat Socket');

    if (
      !user.mutedChannels ||
      !user.mutedChannels.find((chat) => chat.index === payload.chatIndex)
    ) {
      const message = new Message();
      message.chat = await this.chatService.getChat(payload.chatIndex);
      message.sendUser = user;
      message.messageContent = payload.message;
      this.messageRepository.save(message);

      this.server.to(roomName).emit('onMessage', {
        sendUser: {
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
        },
        message: payload.message,
      });
    } else {
      throw new WsChatException('User has been muted from this chat');
    }
  }

  @SubscribeMessage('onDM')
  async onDM(
    client: Socket,
    payload: { receiveUser: string; message: string },
  ) {
    const user = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );
    const receiveUser = await this.usersService.getUser(payload.receiveUser);

    if (user.isBanned) throw new WsException('User is banned');

    if (
      receiveUser.blockings &&
      receiveUser.blockings.find((block) => block.index === user.index)
    )
      throw new WsChatException('User has been blocked');
    else {
      const dm = new DM();
      dm.message = payload.message;
      dm.sendUser = user;
      dm.receiveUser = receiveUser;
      this.dmRepository.save(dm);

      const sendPayload = {
        sendUser: {
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
        },
        message: payload.message,
      };

      const receiveClient = this.wsClients.get(receiveUser.index);
      if (receiveClient) {
        receiveClient.emit('onDM', sendPayload);
      }
      client.emit('onDM', sendPayload);
    }
  }

  @SubscribeMessage('cancelQueue')
  async cancelQueue(client: Socket) {
    const isExistsInQueue = this.gameQueue.findIndex(
      (inQueueClient) => inQueueClient.id === client.id,
    );
    if (isExistsInQueue !== -1) {
      this.gameQueue.splice(isExistsInQueue, 1);
    }
    client.emit('cancelComplete', {
      status: 'CANCELED',
    });
    const user = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );
    await this.usersService.statusChange(user.index, 'ONLINE');
  }

  @SubscribeMessage('quitGame')
  async quitGame(client: Socket, payload: { gameName: string }) {
    client.leave(payload.gameName);
    const user = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );
    this.logger.debug(`${user.nickname} quit game`);
    await this.usersService.statusChange(user.index, 'ONLINE');
  }

  @SubscribeMessage('matchQueue')
  async onMatchQueue(client: Socket) {
    const requestUser = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );
    if (requestUser.isBanned) throw new WsException('User is banned');

    const isExistsInQueue = this.gameQueue.findIndex(
      (inQueueClient) => inQueueClient.id === client.id,
    );
    if (isExistsInQueue !== -1) {
      this.gameQueue.splice(isExistsInQueue, 1);
      this.logger.log('Duplicate Queue Request');
    }
    this.gameQueue.push(client);

    await this.usersService.statusChange(requestUser.index, 'INQUEUE');

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
      await this.usersService.statusChange(player1.index, 'INGAME');
      await this.usersService.statusChange(player2.index, 'INGAME');
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
    await this.matchService.createMatch(payload.createMatchDto);
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

    const receiver = await this.usersService.getUserByIndex(
      payload.receiveUserIndex,
    );

    if (sender.isBanned) {
      client.emit('matchReject', {
        status: 'MATCH_REJECT',
        message: 'User is banned',
      });
      throw new WsException('User is banned');
    }

    if (receiver.status !== UserStatus.ONLINE) {
      client.emit('matchReject', {
        status: 'MATCH_REJECT',
        message: 'User Is Busy',
      });
      return;
    }

    if (
      receiver.blockings.find(
        (blockedUser) => blockedUser.index === sender.index,
      )
    ) {
      client.emit('matchReject', {
        status: 'MATCH_REJECT',
        message: 'Blocked',
      });
      return;
    }

    const gameName = String(`game_${v1()}`);
    client.join(gameName);
    this.wsClients.get(payload.receiveUserIndex).emit('matchRequest', {
      status: 'REQUEST_MATCH',
      sendUserIndex: sender.index,
      sendUserNickname: sender.nickname,
      gameName: gameName,
      ballSpeed: payload.ballSpeed,
    });
    client.emit('requestedGame', {
      status: 'SUCCESS',
      gameName: gameName,
    });
    await this.usersService.statusChange(payload.receiveUserIndex, 'INQUEUE');
    await this.usersService.statusChange(sender.index, 'INQUEUE');
  }

  @SubscribeMessage('cancelRequest')
  async cancelRequest(client: Socket, payload: { gameName: string }) {
    const sender = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );
    this.server.socketsLeave(payload.gameName);
    await this.usersService.statusChange(sender.index, 'ONLINE');
    client.emit('cancelComplete', {
      status: 'CANCELED',
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
    const clients = this.server.sockets.adapter.rooms.has(payload.gameName);
    if (!clients) {
      const receiver = await this.getUserByJwt(
        client.handshake.headers.authorization,
      );
      await this.usersService.statusChange(receiver.index, 'ONLINE');
      throw new WsGameException('Game does not exist');
    }
    switch (payload.status) {
      case 'ACCEPT':
        const player1 = await this.getUserByJwt(
          this.wsClients.get(payload.sendUserIndex).handshake.headers
            .authorization,
        );
        const player2 = await this.getUserByJwt(
          client.handshake.headers.authorization,
        );
        client.join(payload.gameName);
        let game: Game;
        switch (payload.ballSpeed) {
          case 'NORMAL':
            game = this.gameService.gameSet(
              payload.gameName,
              player1,
              player2,
              BallSpeed.NORMAL,
            );
            break;
          case 'FAST':
            game = this.gameService.gameSet(
              payload.gameName,
              player1,
              player2,
              BallSpeed.FAST,
            );
            break;
          default:
            throw new WsGameException('Not Valid Ball Speed');
        }
        this.server.to(payload.gameName).emit('matchComplete', {
          status: 'GAME_START',
          gameName: payload.gameName,
          frameInfo: game.frameInfo,
          gameInfo: game.gameInfo,
          player1Info: game.playerInfo[0],
          player2Info: game.playerInfo[1],
          ballInfo: game.ballInfo,
        });
        await this.usersService.statusChange(player1.index, 'INGAME');
        await this.usersService.statusChange(player2.index, 'INGAME');
        break;
      case 'REJECT':
        this.server.socketsLeave(payload.gameName);
        const receiveUser = await this.getUserByJwt(
          client.handshake.headers.authorization,
        );
        this.wsClients.get(payload.sendUserIndex).emit('matchReject', {
          status: 'MATCH_REJECT',
          message: 'Request has been rejected',
        });
        await this.usersService.statusChange(receiveUser.index, 'ONLINE');
        await this.usersService.statusChange(payload.sendUserIndex, 'ONLINE');
        break;
      default:
        const sockets = await this.server.in(payload.gameName).fetchSockets();
        for (const socket of sockets) {
          const user = await this.getUserByJwt(
            socket.handshake.headers.authorization,
          );
          await this.usersService.statusChange(user.index, 'ONLINE');
        }
        throw new WsGameException('Bad Request');
    }
  }

  @SubscribeMessage('observeMatch')
  async observeMatch(client: Socket, payload: { matchInUserIndex: number }) {
    const user = await this.getUserByJwt(
      client.handshake.headers.authorization,
    );

    if (user.isBanned) throw new WsException('User is banned');

    let gameName = '';
    this.wsClients.get(payload.matchInUserIndex).rooms.forEach((room) => {
      if (room.indexOf('game_') !== -1) gameName = room;
    });
    if (gameName === '') {
      throw new WsGameException('Not in Game');
    }
    const game = this.gameService.getGame(gameName);

    if (!game) {
      throw new WsGameException('Invalid Game');
    }

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

    await this.usersService.statusChange(user.index, 'INGAME');
  }

  async getUserByJwt(jwtToken: string): Promise<User> {
    const jwtDecode = this.jwtService.verify(jwtToken);
    return await this.usersService.getUser(jwtDecode.username);
  }

  async getUserWithChatByJwt(jwtToken: string): Promise<User> {
    const jwtDecode = this.jwtService.verify(jwtToken);

    return await this.userRepository.findOne({
      where: { index: jwtDecode.sub },
      relations: ['joinChannels', 'mutedChannels', 'bannedChannels'],
    });
  }

  async validateChatUser(token: string, chatIndex: number): Promise<User> {
    let user: User;
    let chat: Chat;
    try {
      user = await this.getUserWithChatByJwt(token);
    } catch (e) {
      if (e instanceof EntityNotFoundError)
        throw new WsChatException('User Not Found');
      else throw e;
    }
    try {
      chat = await this.chatService.getChat(chatIndex);
    } catch (e) {
      if (e instanceof EntityNotFoundError)
        throw new WsChatException('Chat Not Found');
      else throw e;
    }
    if (
      chat.bannedUsers &&
      chat.bannedUsers.find((bannedUser) => bannedUser.index === user.index)
    )
      throw new WsChatException('User Banned from the Chat');
    if (!chat.joinUsers.find((joinUser) => joinUser.index === user.index))
      throw new WsChatException('User Not Joined in the Chat');
    return user;
  }
}
