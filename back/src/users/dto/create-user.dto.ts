import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'nickname', example: 'skiZzang' })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: 'user email',
    example: 'hyeonski@student.42seoul.kr',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'user image url',
    example: 'http://cdn.intra.42.fr/users/hyeonski.jpg',
    required: false,
  })
  @IsString()
  avatar: string;
}
