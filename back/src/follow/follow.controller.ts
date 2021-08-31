import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@UseGuards(JwtAuthGuard)
@Controller('follow')
@ApiTags('Follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get()
  @ApiOperation({
    summary: '팔로우 하고 있는 유저 조회',
    description: '현재 유저가 팔로우 하고 있는 전체 유저를 조회한다.',
  })
  @ApiOkResponse({
    description: 'follow한 user의 배열',
    type: User,
    isArray: true,
  })
  async getFollowings(@Req() req: any) {
    return await this.followService.getFollowings(req.user);
  }

  @Post()
  @ApiOperation({ summary: '유저 팔로잉 등록' })
  @ApiCreatedResponse({
    description: 'follow 성공, user 자신의 정보 response',
    type: User,
  })
  async registerFollowing(@Req() req: any, @Body() followDto: FollowDto) {
    return await this.followService.registerFollowing(req.user, followDto);
  }

  @Delete()
  @ApiOperation({ summary: '유저 언팔로잉' })
  @ApiOkResponse({
    description: 'follow 해제 성공, user 자신의 정보 response',
    type: User,
  })
  async unRegisterFollowing(@Req() req: any, @Body() followDto: FollowDto) {
    return await this.followService.unRegisterFollowing(req.user, followDto);
  }
}
