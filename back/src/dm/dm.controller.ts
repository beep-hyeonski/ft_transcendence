import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { DmService } from './dm.service';

@ApiTags('dm')
@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get(':nickname')
  async getDMByNickname(@Req() req: any, @Param() nickname: string) {
    return await this.dmService.getDMByNickname(req.user, nickname);
  }
}
