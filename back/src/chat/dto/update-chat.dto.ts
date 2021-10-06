import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ChatStatus } from '../entities/chat.entity';

export class UpdateChatDto {
  @ApiProperty({
    description: 'Chat Title',
    example: 'Come in without Juyang!',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Chat Status', example: 'protected' })
  @IsEnum(ChatStatus)
  status: ChatStatus;

  @ApiProperty({
    description: 'Protected 채널일 경우 입장 Password',
    example: 'a1b2c3',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Invaid Password Length',
  })
  @MaxLength(20, {
    message: 'Invaid Password Length',
  })
  password: string;
}
