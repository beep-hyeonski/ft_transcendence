import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { User } from 'src/users/entities/user.entity';
import { Server } from 'socket.io';
import { WsGameException } from 'src/filters/websocket-exception.filter';

interface IBallInfo {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  color: string;
}

interface IFrameInfo {
  frameWidth: number;
  frameHeight: number;
}

interface IGameInfo {
  ballSpeed: number;
  stickMoveSpeed: number;
  player1: string;
  player1Nickname: string;
  player2: string;
  player2Nickname: string;
}

interface IPlayerInfo {
  x: number;
  y: number;
  stickWidth: number;
  stickHeight: number;
  score: number;
  color: string;
}

export enum BallSpeed {
  NORMAL = 10,
  FAST = 20,
}

export enum KeyState {
  upKey = 'upKey',
  downKey = 'downKey',
}

export class Game {
  frameInfo: IFrameInfo;
  gameInfo: IGameInfo;
  playerInfo: Array<IPlayerInfo> = [];
  ballInfo: IBallInfo;
  collidePoint: number;
  angle: number;
  direction: number;
  private gameService: GameService;

  constructor(
    player1: string,
    player1Nickname: string,
    player2: string,
    player2Nickname: string,
    ballSpeed: BallSpeed,
  ) {
    this.gameService = new GameService();
    this.frameInfo = {
      frameWidth: 1400,
      frameHeight: 700,
    };
    this.gameInfo = {
      ballSpeed: ballSpeed,
      stickMoveSpeed: 15,
      player1: player1,
      player1Nickname: player1Nickname,
      player2: player2,
      player2Nickname: player2Nickname,
    };
    this.playerInfo.push({
      x: 0,
      y: this.frameInfo.frameHeight / 2 - 75,
      stickWidth: 30,
      stickHeight: this.frameInfo.frameHeight / 5,
      score: 0,
      color: 'blue',
    });
    this.playerInfo.push({
      x: this.frameInfo.frameWidth - 30,
      y: this.frameInfo.frameHeight / 2 - 75,
      stickWidth: 30,
      stickHeight: this.frameInfo.frameHeight / 5,
      score: 0,
      color: 'blue',
    });
    this.ballInfo = {
      x: this.frameInfo.frameWidth / 2,
      y: this.frameInfo.frameHeight / 2,
      radius: 15,
      velocityX: 5,
      velocityY: 2,
      speed: ballSpeed,
      color: 'yellow',
    };
    this.collidePoint =
      this.ballInfo.y -
      (this.frameInfo.frameWidth / 2 + this.frameInfo.frameHeight / 2 / 2);
    this.collidePoint /=
      this.frameInfo.frameWidth / 2 + this.frameInfo.frameHeight / 2 / 2;
    this.angle = Math.random() * (Math.PI / 4) * this.collidePoint;
    this.direction =
      this.ballInfo.x + this.ballInfo.radius < this.frameInfo.frameWidth / 2
        ? 1
        : -1;
    this.ballInfo.velocityX =
      Math.cos(this.angle) * this.ballInfo.speed * this.direction;
    this.ballInfo.velocityY = Math.sin(this.angle) * this.ballInfo.speed;
  }
}

@Injectable()
export class GameService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  gameList: Map<string, Game> = new Map<string, Game>();
  server: Server;

  attachServer(server: Server) {
    this.server = server;
  }

  gameSet(
    gameName: string,
    player1: User,
    player2: User,
    ballSpeed: BallSpeed,
  ): Game {
    const newGame: Game = new Game(
      player1.username,
      player1.nickname,
      player2.username,
      player2.nickname,
      ballSpeed,
    );
    this.gameList.set(gameName, newGame);
    return newGame;
  }

  collision(game: Game, playerNumber: 1 | 2): boolean {
    const playerInfo: IPlayerInfo = game.playerInfo[playerNumber - 1];
    const playerTop = playerInfo.y;
    const playerBottom = playerInfo.y + playerInfo.stickHeight;
    const playerLeft = playerInfo.x;
    const playerRight = playerInfo.x + playerInfo.stickWidth;
    const ballInfo: IBallInfo = game.ballInfo;
    const ballTop = ballInfo.y - ballInfo.radius;
    const ballBottom = ballInfo.y + ballInfo.radius;
    const ballLeft = ballInfo.x - ballInfo.radius;
    const ballRight = ballInfo.x + ballInfo.radius;
    return (
      ballRight > playerLeft &&
      ballBottom > playerTop &&
      ballLeft < playerRight &&
      ballTop < playerBottom
    );
  }

  ballReset(game: Game) {
    game.ballInfo.x = game.frameInfo.frameWidth / 2;
    game.ballInfo.y = game.frameInfo.frameHeight / 2;
    game.ballInfo.velocityY = Math.floor(Math.random() * 4.0);
    game.ballInfo.velocityX *= -1;
    if (game.ballInfo.velocityY % 2 === 0) {
      game.ballInfo.velocityY *= -1;
    }
  }

  applyEvent(gameName: string, sender: string, keyState: KeyState) {
    const game: Game = this.getGame(gameName);

    if (!game) {
      throw new WsGameException('Invalid Game');
    }

    let playerNumber: number;
    if (game.gameInfo.player1 === sender) {
      playerNumber = 0;
    } else if (game.gameInfo.player2 === sender) {
      playerNumber = 1;
    } else {
      throw new WsGameException('Invalid Player');
    }
    switch (keyState) {
      case 'upKey':
        game.playerInfo[playerNumber].y -= game.gameInfo.stickMoveSpeed;
        if (game.playerInfo[playerNumber].y < 0) {
          game.playerInfo[playerNumber].y = 0;
        }
        break;
      case 'downKey':
        game.playerInfo[playerNumber].y += game.gameInfo.stickMoveSpeed;
        if (
          game.playerInfo[playerNumber].y + game.frameInfo.frameHeight / 5 >
          game.frameInfo.frameHeight
        ) {
          game.playerInfo[playerNumber].y =
            game.frameInfo.frameHeight - game.frameInfo.frameHeight / 5;
        }
        break;
      default:
        throw new WsGameException('Invalid Key Event');
    }
  }

  getGame(gameName: string) {
    return this.gameList.get(gameName);
  }

  closeGame(gameName: string) {
    this.gameList.delete(gameName);
  }

  @Interval('gameLoop', 20)
  gameLoop() {
    const closeGameList: Array<string> = [];

    this.gameList.forEach((game, gameName) => {
      const playerNumber: 1 | 2 =
        game.ballInfo.x + game.ballInfo.radius < game.frameInfo.frameWidth / 2
          ? 1
          : 2;
      if (this.collision(game, playerNumber)) {
        let collidePoint: number =
          game.ballInfo.y -
          (game.playerInfo[playerNumber - 1].y +
            game.playerInfo[playerNumber - 1].stickHeight / 2);
        collidePoint /=
          game.playerInfo[playerNumber - 1].y +
          game.playerInfo[playerNumber - 1].stickHeight / 2;
        const angle: number = (Math.PI / 4) * collidePoint;
        const direction: 1 | -1 =
          game.ballInfo.x + game.ballInfo.radius < game.frameInfo.frameWidth / 2
            ? 1
            : -1;
        game.ballInfo.velocityX =
          Math.cos(angle) * game.ballInfo.speed * direction;
        game.ballInfo.velocityY = Math.sin(angle) * game.ballInfo.speed;
      }
      if (
        game.ballInfo.y + game.ballInfo.radius >= game.frameInfo.frameHeight ||
        game.ballInfo.y - game.ballInfo.radius <= 0
      ) {
        game.ballInfo.velocityY *= -1;
      }
      if (game.ballInfo.x - game.ballInfo.radius < 0) {
        game.playerInfo[1].score += 1;
        this.ballReset(game);
      }
      if (game.ballInfo.x + game.ballInfo.radius > game.frameInfo.frameWidth) {
        game.playerInfo[0].score += 1;
        this.ballReset(game);
      }
      game.ballInfo.x += game.ballInfo.velocityX;
      game.ballInfo.y += game.ballInfo.velocityY;
      this.server.to(gameName).emit('gameLoop', {
        frameInfo: game.frameInfo,
        ballInfo: game.ballInfo,
        player1Info: game.playerInfo[0],
        player2Info: game.playerInfo[1],
      });
      if (game.playerInfo[0].score >= 3 || game.playerInfo[1].score >= 3) {
        closeGameList.push(gameName);
      }
    });

    closeGameList.forEach((gameName) => {
      this.closeGame(gameName);
    });
  }
}
