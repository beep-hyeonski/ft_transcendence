import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import {
  LoginStatus,
  LoginStatusDto,
} from 'src/auth/dto/user-login-status.dto';
import { JwtPayloadDto, JwtPermission } from 'src/auth/dto/jwt-payload.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async getUsers() {
    return await this.userRepository.find({
      relations: ['followings', 'blockings'],
    });
  }

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: [
        'followings',
        'blockings',
        // 'ownerChannels',
        // 'adminChannels',
        // 'joinChannels',
        // 'mutedChannels',
        // 'bannedChannels',
      ],
      where: { username: username },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async getUserWithChat(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: [
        // 'blockings',
        'ownerChannels',
        'adminChannels',
        'joinChannels',
        'mutedChannels',
        'bannedChannels',
      ],
      where: { username: username },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async getUserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      relations: ['followings', 'blockings'],
      where: { nickname: nickname },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async patchUser(jwtPayloadDto: JwtPayloadDto, updateUserDto: UpdateUserDto) {
    const user = await this.getUser(jwtPayloadDto.username);

    for (const fieldName in updateUserDto) {
      user[fieldName] = updateUserDto[fieldName];
    }

    if (updateUserDto.useTwoFA === false) {
      user.twoFAToken = null;
    }

    await this.userRepository.save(user);

    return user;
  }

  async signUp(jwtPayloadDto: JwtPayloadDto, userInfo: CreateUserDto) {
    const user = new User();
    user.username = jwtPayloadDto.username;
    for (const fieldName in userInfo) {
      user[fieldName] = userInfo[fieldName];
    }

    const queryReturn = await this.userRepository.save(user);
    const token = await this.authService.generateJwtToken(
      jwtPayloadDto.username,
      JwtPermission.GENERAL,
      queryReturn.index,
    );

    return new LoginStatusDto(token, LoginStatus.SUCCESS);
  }

  async statusChange(index: number, status: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { index: index },
    });

    switch (status) {
      case 'ONLINE':
        user.status = UserStatus.ONLINE;
        break;
      case 'OFFLINE':
        user.status = UserStatus.OFFLINE;
        break;
      case 'INQUEUE':
        user.status = UserStatus.INQUEUE;
        break;
      case 'INGAME':
        user.status = UserStatus.INGAME;
        break;
      default:
        throw new WsException('Not Valid Status');
    }
    const res = await this.userRepository.save(user);
    this.logger.debug(`${user.nickname} - ${status}`);
  }
}
