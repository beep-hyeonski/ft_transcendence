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
      relations: ['blockings'],
      where: { username: jwtPayloadDto.username },
    });

    return user.blockings;
  }

  async registerBlocking(jwtPayloadDto: JwtPayloadDto, blockDto: BlockDto) {
    if (jwtPayloadDto.username === blockDto.blockedUser) {
      throw new BadRequestException('You cannot block yourself');
    }

    const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

    const blocker = await this.userRepository.findOneOrFail({
      relations: ['blockings'],
      where: { username: jwtPayloadDto.username },
    });

    const blocked = await this.userRepository.findOneOrFail({
      where: { username: blockDto.blockedUser },
    });

    blocker.blockings.push(blocked);

    if (
      !blocker.blockings ||
      !blocker.blockings.find((user) => user.index === blocked.index)
    )
      blocker.blockings.push(blocked);

    try {
      return await this.userRepository.save(blocker);
    } catch (e) {
      if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('You are already blocking this user');
      } else throw e;
    }
  }

  async unRegisterBlocking(jwtPayloadDto: JwtPayloadDto, blockDto: BlockDto) {
    const blocker = await this.userRepository.findOneOrFail({
      relations: ['blockings'],
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
