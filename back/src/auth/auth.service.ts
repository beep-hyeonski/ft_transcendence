import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginStatus, LoginStatusDto } from './dto/user-login-status.dto';
import { JwtPayloadDto, JwtPermission } from './dto/jwt-payload.dto';
import { randomBytes } from 'crypto';
import { EmailMessage, MailjetService } from '@clever-app/nestjs-mailjet';
import { TwoFactorTokenDto } from 'src/auth/dto/two-factor-token.dto';
import { validateOrReject } from 'class-validator';
import { JsonWebTokenError } from 'jsonwebtoken';

const TEMPORARY_TOKEN_INDEX = -1;

export class JwtSignFailedError extends JsonWebTokenError {}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailjetService: MailjetService,
  ) {}

  private logger: Logger = new Logger(AuthService.name);

  async validateUser(userInfo: ValidateUserDto): Promise<LoginUserDto> {
    try {
      await validateOrReject(userInfo);
      if (userInfo.pool_year >= 2020)
        return new LoginUserDto(
          userInfo.login,
          userInfo.email,
          userInfo.image_url,
        );
    } catch (e) {
      this.logger.log(e);
    }
    return null;
  }

  async logIn(user: LoginUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (!existingUser) {
      this.logger.log(`New User [${user.username}] Try to sign up`);
      const signUpToken = await this.generateJwtToken(
        user.username,
        JwtPermission.SIGNUP,
        TEMPORARY_TOKEN_INDEX,
      );
      return new LoginStatusDto(signUpToken, LoginStatus.SIGNUP);
    } else if (existingUser.isBanned) {
      throw new ForbiddenException('User is banned');
    } else if (existingUser.useTwoFA == true) {
      this.logger.log(`User [${existingUser.username}] Loged in: Requires 2fa`);
      existingUser.twoFAToken = await this.generateTwoFactorToken();
      await this.userRepository.save(existingUser);

      try {
        await this.sendMail(existingUser);
        const twoFAToken = await this.generateJwtToken(
          existingUser.username,
          JwtPermission.TWOFA,
          existingUser.index,
        );
        return new LoginStatusDto(twoFAToken, LoginStatus.TWOFA);
      } catch (e) {
        throw new ConflictException('Conflict Request');
      }
    }

    this.logger.log(`User [${existingUser.username}] Loged In`);

    const token = await this.generateJwtToken(
      existingUser.username,
      JwtPermission.GENERAL,
      existingUser.index,
    );
    return new LoginStatusDto(token, LoginStatus.SUCCESS);
  }

  async logOut(requestUser: JwtPayloadDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: requestUser.username },
    });

    if (user.status === UserStatus.ONLINE) {
      user.status = UserStatus.OFFLINE;
    }
    if (user.twoFAToken !== null) {
      user.twoFAToken = null;
    }

    await this.userRepository.save(user);

    return user;
  }

  async checkTwoFactor(
    requestUser: JwtPayloadDto,
    twoFactorTokenDto: TwoFactorTokenDto,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { index: requestUser.sub },
    });

    if (user.useTwoFA !== true)
      throw new ForbiddenException('Did Not Turn On 2-Factor Authorization');
    if (user.twoFAToken !== twoFactorTokenDto.TwoFAToken) {
      throw new UnauthorizedException('Invalid 2-Factor Token');
    }
    if (user.isBanned) throw new ForbiddenException('User is banned');

    this.logger.log(`User [${user.username}] Loged In`);

    const token = await this.generateJwtToken(
      user.username,
      JwtPermission.GENERAL,
      user.index,
    );
    return new LoginStatusDto(token, LoginStatus.SUCCESS);
  }

  async generateJwtToken(
    username: string,
    permission: JwtPermission,
    index: number,
  ): Promise<string> {
    try {
      const payload: JwtPayloadDto = {
        username: username,
        permission: permission,
        sub: index,
      };
      const token = this.jwtService.sign(payload);
      return token;
    } catch (e) {
      throw new JwtSignFailedError(e.message);
    }
  }

  async generateTwoFactorToken(): Promise<string> {
    return randomBytes(3).toString('hex');
  }

  async sendMail(user: User) {
    const emailMessage: EmailMessage<null> = {
      From: {
        Email: 'juyang@student.42seoul.kr',
        Name: 'beep-hyeonski',
      },
      To: [
        {
          Email: user.email,
          Name: user.username,
        },
      ],
      Subject: 'beep-hyeonski 2-Factor Authenticate Token',
      TextPart: `2-Factor Authenticate Code: ${user.twoFAToken}`,
    };

    return await this.mailjetService.sendMail([emailMessage]);
  }
}
