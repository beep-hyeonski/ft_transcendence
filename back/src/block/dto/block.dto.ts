import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BlockDto {
  @ApiProperty({
    description: 'user가 차단/해제할 다른 user',
  })
  @IsString()
  blockedUser: string;
}
