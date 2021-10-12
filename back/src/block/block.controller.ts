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
import { BlockDto } from './dto/block.dto';
import { BlockService } from './block.service';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('Block')
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @ApiOperation({
    summary: '차단 하고 있는 유저 조회',
    description: '현재 유저가 차단 하고 있는 전체 유저를 조회한다.',
  })
  @ApiOkResponse({
    description: '차단한 user의 배열',
    type: User,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: '등록되지 않은 유저 (Not Found)' })
  @Get()
  async getBlockedUsers(@Req() req: any) {
    return await this.blockService.getBlockings(req.user);
  }

  @ApiOperation({ summary: '유저 차단' })
  @ApiCreatedResponse({
    description: '차단 성공, user 자신의 정보 response',
    type: User,
  })
  @ApiBadRequestResponse({
    description:
      '자기 자신 차단 불가 (You cannot block yourself) && \
      이미 차단하고 있는 유저 (You are already blocking this user)',
  })
  @ApiNotFoundResponse({ description: '등록되지 않은 유저 (Not Found)' })
  @Post()
  async registerBlockUser(@Req() req: any, @Body() blockDto: BlockDto) {
    return await this.blockService.registerBlocking(req.user, blockDto);
  }

  @Delete()
  @ApiOperation({ summary: '유저 차단 해제' })
  @ApiOkResponse({
    description: '차단 해제 성공, user 자신의 정보 response',
    type: User,
  })
  @ApiNotFoundResponse({ description: '등록되지 않은 유저 (Not Found)' })
  async unRegisterBlockedUser(@Req() req: any, @Body() blockDto: BlockDto) {
    return await this.blockService.unRegisterBlocking(req.user, blockDto);
  }
}
