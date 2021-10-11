import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  Post,
  Delete,
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

  @ApiOperation({ summary: '내 채팅 정보 조회' })
  @ApiOkResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Get('me/chat')
  async getUserWithChat(@Req() req: any) {
    return await this.usersService.getUserWithChat(req.user.username);
  }

  @ApiOperation({ summary: 'user ban 목록 조회' })
  @ApiOkResponse({ type: User, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get('ban')
  async getBannedUsers(@Req() req: any) {
    return await this.usersService.getBannedUsers(req.userData);
  }

  @ApiOperation({ summary: 'user ban 등록' })
  @Post('ban/:username')
  @UseGuards(JwtAuthGuard)
  async banUser(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.banUser(req.userData, username);
  }

  @ApiOperation({ summary: 'user ban 해제' })
  @Delete('ban/:username')
  @UseGuards(JwtAuthGuard)
  async unbanUser(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.unbanUser(req.userData, username);
  }

  @ApiOperation({ summary: 'user admin 목록 조회' })
  @ApiOkResponse({ type: User, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminUsers(@Req() req: any) {
    return await this.usersService.getAdminUsers(req.userData);
  }

  @ApiOperation({ summary: 'user admin 등록' })
  @Post('admin/:username')
  @UseGuards(JwtAuthGuard)
  async registerAdmin(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.registerAdmin(req.userData, username);
  }

  @ApiOperation({ summary: 'user admin 해제' })
  @Delete('admin/:username')
  @UseGuards(JwtAuthGuard)
  async unregisterAdmin(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.unregisterAdmin(req.userData, username);
  }

  @ApiOperation({
    summary: 'nickname 검색',
    description: 'nickname에 해당하는 user의 정보를 조회한다.',
  })
  @ApiOkResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  @Get(':nickname')
  getUser(@Param('nickname') nickname: string) {
    return this.usersService.getUserByNickname(nickname);
  }
}
