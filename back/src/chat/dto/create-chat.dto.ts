import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ChatStatus } from '../entities/chat.entity';

export class CreateChatDto {
  @ApiProperty({
    description: 'Chat Title',
    example: 'Come in without Hyeonski!',
  })
  @IsString()
  @MaxLength(20, { message: 'Invalid Chat Title Length' })
  title: string;

  @ApiProperty({ description: 'Chat Status', example: 'public' })
  @IsEnum(ChatStatus)
  status: ChatStatus;

  @ApiProperty({
    description: 'Protected 채널일 경우 입장 Password',
    example: 'a1b2c3',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Invalid Password Length' })
  @MaxLength(20, { message: 'Invalid Password Length' })
  password: string;
}
