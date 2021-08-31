import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FollowDto {
  @ApiProperty({
    description: 'user가 팔로우/언팔로우할 다른 user',
  })
  @IsString()
  followedUser: string;
}
