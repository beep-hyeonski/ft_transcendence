import { IsEnum, IsString } from 'class-validator';

export enum LoginStatus {
  SIGNUP = 'signup',
  TWOFA = 'twofa',
  SUCCESS = 'success',
}

export class LoginStatusDto {
  constructor(jwt: string, status: LoginStatus) {
    this.jwt = jwt;
    this.status = status;
  }

  @IsString()
  jwt: string;

  @IsEnum(LoginStatus)
  status: LoginStatus;
}
