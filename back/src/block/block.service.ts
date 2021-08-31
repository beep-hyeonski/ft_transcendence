import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlockDto } from './dto/block.dto';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getBlockings(jwtPayloadDto: JwtPayloadDto): Promise<User[]> {
    const user = await this.userRepository.findOneOrFail({
      relations: ['blockings', 'blockers'],
      where: { username: jwtPayloadDto.username },
    });

    return user.blockings;
  }

  async registerBlocking(jwtPayloadDto: JwtPayloadDto, blockDto: BlockDto) {
    if (jwtPayloadDto.username === blockDto.blockedUser) {
      throw new BadRequestException('You cannot block yourself');
    }

    const blocker = await this.userRepository.findOneOrFail({
      relations: ['blockings', 'blockers'],
      where: { username: jwtPayloadDto.username },
    });

    const blocked = await this.userRepository.findOneOrFail({
      where: { username: blockDto.blockedUser },
    });

    blocker.blockings.push(blocked);
    return await this.userRepository.save(blocker);
  }

  async unRegisterBlocking(jwtPayloadDto: JwtPayloadDto, blockDto: BlockDto) {
    const blocker = await this.userRepository.findOneOrFail({
      relations: ['blockings', 'blockers'],
      where: { username: jwtPayloadDto.username },
    });

    const deleteBlocked = await this.userRepository.findOneOrFail({
      where: { username: blockDto.blockedUser },
    });

    blocker.blockings = blocker.blockings.filter(
      (blocking) => blocking.index !== deleteBlocked.index,
    );
    return this.userRepository.save(blocker);
  }
}
