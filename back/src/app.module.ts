import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { AppLoggerMiddleware } from './app-logger.middleware';
import { FollowModule } from './follow/follow.module';
import { BlockModule } from './block/block.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { Message } from './chat/entities/message.entity';
import { AppGateway } from './app.gateway';
import { Match } from './match/entities/match.entity';
import { MatchModule } from './match/match.module';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DmModule } from './dm/dm.module';
import { DM } from './dm/entities/dm.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Chat, Message, Match, DM],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Message, DM, User]),
    UsersModule,
    AuthModule,
    FollowModule,
    BlockModule,
    ChatModule,
    MatchModule,
    GameModule,
    ScheduleModule.forRoot(),
    DmModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
