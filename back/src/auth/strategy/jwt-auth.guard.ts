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
import { JwtPermission } from '../dto/jwt-payload.dto';
import { jwtConstants } from './constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private reflector: Reflector) {
    super();
  }

  logger: Logger = new Logger(JwtAuthGuard.name);

  /*
   * Jwt token validation
   * check the token and permission
   */

  canActivate(context: ExecutionContext) {
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

  validateToken(token: string) {
    const secretKey = jwtConstants.secret;

    const verify = this.jwtService.verify(token, { secret: secretKey });
    return verify;
  }
}
