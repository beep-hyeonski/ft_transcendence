import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsUrl } from 'class-validator';

export class LoginUserDto {
  constructor(username: string, email: string, avatar: string) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
  }
  @ApiProperty({ description: 'username', example: 'hyeonski' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'user email',
    example: 'hyeonski@student.42seoul.kr',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'avatar image url',
    example: 'http://cdn.intra.42.fr/users/hyeonski.jpg',
  })
  @IsUrl()
  avatar: string;
}
