import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TwoFactorTokenDto {
  @ApiProperty({
    description: '이메일로 발송된 2단계 인증 토큰',
  })
  @IsString()
  TwoFAToken: string;
}
