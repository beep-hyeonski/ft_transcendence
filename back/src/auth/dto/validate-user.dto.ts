import { IsString, IsEmail, IsUrl, IsNumber } from 'class-validator';

export class ValidateUserDto {
  constructor(
    login: string,
    email: string,
    image_url: string,
    pool_year: number,
  ) {
    this.login = login;
    this.email = email;
    this.image_url = image_url;
    this.pool_year = pool_year;
  }

  @IsString()
  login: string;

  @IsEmail()
  email: string;

  @IsUrl()
  image_url: string;

  @IsNumber()
  pool_year: number;
}
