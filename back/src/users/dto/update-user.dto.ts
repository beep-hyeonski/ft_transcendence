import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'skiZzang',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({
    description: 'user의 프로필 이미지 url',
    example: 'http://cdn.intra.42.fr/users/hyeonski.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({
    description: '2-factor 인증 사용 여부, true/false',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  useTwoFA: boolean;
}
