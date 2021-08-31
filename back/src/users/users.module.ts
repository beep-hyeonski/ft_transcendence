import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FollowModule } from '../follow/follow.module';
import { BlockModule } from 'src/block/block.module';
import { ImagesController } from './images/images.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => FollowModule),
    forwardRef(() => BlockModule),
  ],
  controllers: [UsersController, ImagesController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
