import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { DM } from './entities/dm.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([DM, User])],
  controllers: [DmController],
  providers: [DmService],
})
export class DmModule {}
