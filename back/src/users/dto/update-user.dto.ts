import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDataURI,
  IsNumber,
  IsBoolean,
} from 'class-validator';

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
  @IsDataURI()
  avatar: string;

  @ApiProperty({
    description: 'user rating score',
    example: '100',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  score: number;

  @ApiProperty({
    description: '게임 승리 횟수',
    example: '5',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  victory: number;

  @ApiProperty({
    description: '게임 패배 횟수',
    example: '0',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  defeat: number;

  @ApiProperty({
    description: '2-factor 인증 사용 여부, true/false',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  useTwoFA: boolean;
}
