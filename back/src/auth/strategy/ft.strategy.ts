import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.INTRA_API_UID,
      clientSecret: process.env.INTRA_API_SECRET,
      callbackURL: process.env.INTRA_API_CALLBACK_URL,
    });
  }

  private logger: Logger = new Logger(FtStrategy.name);

  async validate(
    token: string,
    rt: string,
    profile: any,
  ): Promise<LoginUserDto> {
    try {
      this.logger.debug('oauth validation');
      const { login, email, image_url, pool_year } = profile._json;
      const userInfo = new ValidateUserDto(
        login,
        email,
        image_url,
        parseInt(pool_year),
      );

      const user = await this.authService.validateUser(userInfo);
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }
      return user;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }
}
