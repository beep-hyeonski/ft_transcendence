import { SetMetadata } from '@nestjs/common';
import { JwtPermission } from '../dto/jwt-payload.dto';

export const Permission = (...permissions: JwtPermission[]) =>
  SetMetadata('Permission', permissions);
