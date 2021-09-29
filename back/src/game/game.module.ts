import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GameService } from './game.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
