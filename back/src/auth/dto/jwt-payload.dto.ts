import { IsString, IsNumber, IsEnum } from 'class-validator';

export enum JwtPermission {
  SIGNUP = 'SIGNUP',
  TWOFA = 'TWOFA',
  GENERAL = 'GENERAL',
  ADMIN = 'ADMIN',
}

export class JwtPayloadDto {
  constructor(username: string, permission: JwtPermission, sub: number) {
    this.username = username;
    this.permission = permission;
    this.sub = sub;
  }

  @IsString()
  username: string;

  @IsEnum(JwtPermission)
  permission: JwtPermission;

  @IsNumber()
  sub: number;
}
