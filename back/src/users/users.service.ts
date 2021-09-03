import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import {
  LoginStatus,
  LoginStatusDto,
} from 'src/auth/dto/user-login-status.dto';
import { JwtPayloadDto, JwtPermission } from 'src/auth/dto/jwt-payload.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async getUsers() {
    return await this.userRepository.find({
      relations: ['followings', 'followers', 'blockings', 'blockers'],
    });
  }

  async getUser(username: string) {
    const user = await this.userRepository.findOne({
      relations: ['followings', 'followers', 'blockings', 'blockers'],
      where: { username: username },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async getUserByNickname(nickname: string) {
    const user = await this.userRepository.findOne({
      relations: ['followings', 'followers', 'blockings', 'blockers'],
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
}
