import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getFollowings(jwtPayloadDto: JwtPayloadDto): Promise<User[]> {
    const user = await this.userRepository.findOneOrFail({
      relations: ['followings'],
      where: { username: jwtPayloadDto.username },
    });

    return user.followings;
  }

  async registerFollowing(jwtPayloadDto: JwtPayloadDto, followDto: FollowDto) {
    if (jwtPayloadDto.username === followDto.followedUser) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

    const follower = await this.userRepository.findOneOrFail({
      relations: ['followings'],
      where: { username: jwtPayloadDto.username },
    });

    const followed = await this.userRepository.findOneOrFail({
      where: { username: followDto.followedUser },
    });

    if (
      !follower.followings ||
      !follower.followings.find((user) => user.index === followed.index)
    )
      follower.followings.push(followed);

    try {
      return await this.userRepository.save(follower);
    } catch (e) {
      if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('You are already following this user');
      } else throw e;
    }
  }

  async unRegisterFollowing(
    jwtPayloadDto: JwtPayloadDto,
    followDto: FollowDto,
  ) {
    const follower = await this.userRepository.findOne({
      relations: ['followings'],
      where: { username: jwtPayloadDto.username },
    });

    const deleteFollowed = await this.userRepository.findOne({
      where: { username: followDto.followedUser },
    });

    follower.followings = follower.followings.filter(
      (followings) => followings.index !== deleteFollowed.index,
    );
    return this.userRepository.save(follower);
  }
}
