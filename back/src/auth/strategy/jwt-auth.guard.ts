import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayloadDto, JwtPermission } from '../dto/jwt-payload.dto';
import { jwtConstants } from './constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  logger: Logger = new Logger(JwtAuthGuard.name);

  /*
   * Jwt token validation
   * check the token and permission
   */

  async canActivate(context: ExecutionContext) {
    const permissions = this.reflector.get<JwtPermission[]>(
      'Permission',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new UnauthorizedException('Token is not arrived');
    }

    const token = authorization.replace('Bearer ', '');
    request.user = this.validateToken(token);
    request.userData = await this.userRepository.findOne({
      where: { index: request.user.sub },
    });

    if (
      request.user.sub !== -1 &&
      (!request.userData || request.user.username !== request.userData.username)
    ) {
      throw new UnauthorizedException('invalid token');
    }

    if (request.userData && request.userData.isBanned)
      throw new ForbiddenException('User is banned');

    // Permission 데이터가 없는 경우 GENERAL 및 ADMIN 권한으로 설정
    if (!permissions) {
      if (
        request.user.permission === JwtPermission.GENERAL ||
        request.user.permission === JwtPermission.ADMIN
      )
        return true;
      return false;
    }

    if (!permissions.includes(request.user.permission))
      throw new ForbiddenException('You are not allowed to access');

    return true;
  }

  validateToken(token: string): JwtPayloadDto {
    const secretKey = jwtConstants.secret;

    const verify = this.jwtService.verify(token, { secret: secretKey });
    return verify;
  }
}
