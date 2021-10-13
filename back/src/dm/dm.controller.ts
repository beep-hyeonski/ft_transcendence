import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { DmService } from './dm.service';

@ApiTags('dm')
@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get(':username')
  @ApiOperation({ summary: 'username에 해당하는 유저와 주고받은 메세지 조회' })
  @ApiOkResponse({ description: '메세지 시간 오름차순으로 응답' })
  @ApiNotFoundResponse({ description: '상대 유저가 없을 경우 (Not Found)' })
  async getDMByUsername(@Req() req: any, @Param('username') username: string) {
    return await this.dmService.getDMByUsername(req.user, username);
  }
}
