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
      relations: ['followings', 'followers'],
      where: { username: jwtPayloadDto.username },
    });

    return user.followings;
  }

  async registerFollowing(jwtPayloadDto: JwtPayloadDto, followDto: FollowDto) {
    if (jwtPayloadDto.username === followDto.followedUser) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepository.findOneOrFail({
      relations: ['followings', 'followers'],
      where: { username: jwtPayloadDto.username },
    });

    const followed = await this.userRepository.findOneOrFail({
      where: { username: followDto.followedUser },
    });

    follower.followings.push(followed);
    return await this.userRepository.save(follower);
  }

  async unRegisterFollowing(
    jwtPayloadDto: JwtPayloadDto,
    followDto: FollowDto,
  ) {
    const follower = await this.userRepository.findOne({
      relations: ['followings', 'followers'],
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
