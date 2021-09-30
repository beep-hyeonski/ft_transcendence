import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameService } from './game.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
