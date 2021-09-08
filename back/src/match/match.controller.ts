import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchService } from './match.service';

@ApiTags('Match')
// @UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@ApiOperation({ summary: '전체 매치 조회' })
	@ApiOkResponse({ description: '전체 매치 배열' })
	@Get()
	getMatches() {
		return this.matchService.getMatches();
	}

	@ApiOperation({ summary: '매치 데이터 생성' })
	@ApiOkResponse({ description: '생성된 매치 데이터' })
	@Post()
	createMatch(@Body() CreateMatchDto: CreateMatchDto) {
		return this.matchService.createMatch(CreateMatchDto);
	}

	@ApiOperation({ summary: '특정 유저 매치 데이터 조회' })
	@ApiOkResponse({ description: '특정 유저 매치 리스트' })
	@Get(':username')
	getMatch(@Param('username') username: string) {
		return this.matchService.getMatch(username);
	}
}
