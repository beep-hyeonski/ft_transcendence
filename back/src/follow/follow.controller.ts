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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
  @ApiNotFoundResponse({
    description: '유저 자신 정보를 찾을 수 없음 (Not Found)',
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
  @ApiBadRequestResponse({
    description:
      '자기 자신 팔로우 불가 (You cannot follow yourself) ||\
      이미 해당 유저를 팔로우하고 있음 (You are already following this user)',
  })
  @ApiNotFoundResponse({
    description:
      '팔로우 대상 유저가 없음 (Not Found) ||\
      자신 유저 정보가 없음 (Not Found)',
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
  @ApiNotFoundResponse({
    description:
      '팔로우 헤재 대상 유저 정보가 없음 (Not Found) ||\
      자신 유저 정보가 없음 (Not Found)',
  })
  async unRegisterFollowing(@Req() req: any, @Body() followDto: FollowDto) {
    return await this.followService.unRegisterFollowing(req.user, followDto);
  }
}
