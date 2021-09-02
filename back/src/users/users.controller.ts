import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '전체 유저 조회' })
  @ApiOkResponse({
    description: '전체 유저 정보 배열',
    type: User,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: '내 정보 검색' })
  @ApiOkResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getUser(req.user.username);
  }

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiOkResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  patchUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.patchUser(req.user, updateUserDto);
  }

  @ApiOperation({
    summary: 'username 검색',
    description: 'username에 해당하는 user의 정보를 조회한다.',
  })
  @ApiOkResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }
}
