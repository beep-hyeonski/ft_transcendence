import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { DM } from './entities/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(DM) private dmRepository: Repository<DM>,
  ) {}

  async getDMByUsername(jwtPayloadDto: JwtPayloadDto, username: string) {
    const otherUser = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const dms = await this.dmRepository.find({
      relations: ['sendUser', 'receiveUser'],
      order: { createdAt: 'ASC' },
    });
    return dms.filter(
      (dm) =>
        (dm.sendUser.index === jwtPayloadDto.sub &&
          dm.receiveUser.index === otherUser.index) ||
        (dm.sendUser.index === otherUser.index &&
          dm.receiveUser.index === jwtPayloadDto.sub),
    );
  }
}
