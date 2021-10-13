import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, UserStatus } from './entities/user.entity';
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
      relations: ['followings', 'blockings'],
      where: { username },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async getUserByIndex(index: number): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['followings', 'blockings'],
      where: { index },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async getUserWithChat(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['joinChannels'],
      where: { username },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async getUserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      relations: ['followings', 'blockings'],
      where: { nickname },
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
      where: { index },
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
    await this.userRepository.save(user);
    this.logger.debug(`${user.nickname} - ${status}`);
  }

  async getBannedUsers(user: User) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('You are not admin');
    }
    return await this.userRepository.find({
      where: { isBanned: true },
    });
  }

  async banUser(user: User, username: string) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('You are not admin');
    }

    const targetUser = await this.getUser(username);
    if (targetUser.role !== UserRole.USER) {
      throw new BadRequestException('You cannot ban admin or owner');
    }
    targetUser.isBanned = true;
    return await this.userRepository.save(targetUser);
  }

  async unbanUser(user: User, username: string) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('You are not admin');
    }

    const targetUser = await this.getUser(username);
    targetUser.isBanned = false;
    return await this.userRepository.save(targetUser);
  }

  async getAdminUsers(user: User) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('You are not admin');
    }
    return await this.userRepository.find({
      where: [{ role: UserRole.ADMIN }, { role: UserRole.OWNER }],
    });
  }

  async registerAdmin(user: User, username: string) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('You are not owner');
    }

    const targetUser = await this.getUser(username);
    targetUser.role = UserRole.ADMIN;
    return await this.userRepository.save(targetUser);
  }

  async unregisterAdmin(user: User, username: string) {
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('You are not owner');
    }
    if (user.username === username) {
      throw new BadRequestException('You cannot unregister admin yourself');
    }

    const targetUser = await this.getUser(username);
    targetUser.role = UserRole.USER;
    return await this.userRepository.save(targetUser);
  }
}
