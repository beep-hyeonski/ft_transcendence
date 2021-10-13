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
  Query,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '유저 조회' })
  @ApiOkResponse({
    description:
      '전체 유저 정보 배열 || username 또는 nickname에 해당하는 유저 정보',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(
    @Query('username') username: string,
    @Query('nickname') nickname: string,
  ) {
    if (username) {
      return await this.usersService.getUser(username);
    }
    if (nickname) {
      return await this.usersService.getUserByNickname(nickname);
    }
    return await this.usersService.getUsers();
  }

  @ApiOperation({ summary: '내 정보 검색' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: '내 정보가 없는 경우 (User Not Found)' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return await this.usersService.getUser(req.user.username);
  }

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: '내 정보가 없는 경우 (User Not Found)' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async patchUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.patchUser(req.user, updateUserDto);
  }

  @ApiOperation({ summary: '내 채팅 정보 조회' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: '내 정보가 없는 경우 (User Not Found)' })
  @UseGuards(JwtAuthGuard)
  @Get('me/chat')
  async getUserWithChat(@Req() req: any) {
    return await this.usersService.getUserWithChat(req.user.username);
  }

  @ApiOperation({ summary: 'user ban 목록 조회' })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiForbiddenResponse({
    description:
      '웹 owner 또는 admin이 아닌 경우 권한 없음 (You are not admin)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('ban')
  async getBannedUsers(@Req() req: any) {
    return await this.usersService.getBannedUsers(req.userData);
  }

  @ApiOperation({ summary: 'user ban 등록' })
  @ApiForbiddenResponse({
    description:
      '웹 owner 또는 admin이 아닌 경우 권한 없음 (You are not admin)',
  })
  @ApiBadRequestResponse({
    description: '웹 owner 또는 admin ban 불가 (You cannot ban admin or owner)',
  })
  @Post('ban/:username')
  @UseGuards(JwtAuthGuard)
  async banUser(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.banUser(req.userData, username);
  }

  @ApiOperation({ summary: 'user ban 해제' })
  @ApiForbiddenResponse({
    description:
      '웹 owner 또는 admin이 아닌 경우 권한 없음 (You are not admin)',
  })
  @ApiNotFoundResponse({
    description: 'ban 해제할 유저의 정보가 없는 경우 (User Not Found)',
  })
  @Delete('ban/:username')
  @UseGuards(JwtAuthGuard)
  async unbanUser(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.unbanUser(req.userData, username);
  }

  @ApiOperation({ summary: 'user admin 목록 조회' })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiForbiddenResponse({
    description:
      '웹 owner 또는 admin이 아닌 경우 권한 없음 (You are not admin)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminUsers(@Req() req: any) {
    return await this.usersService.getAdminUsers(req.userData);
  }

  @ApiOperation({ summary: 'user admin 등록' })
  @ApiForbiddenResponse({
    description: '웹 owner가 아닌 경우 권한 없음 (You are not owner)',
  })
  @ApiNotFoundResponse({
    description: 'admin으로 등록할 유저의 정보가 없는 경우 (User Not Found)',
  })
  @Post('admin/:username')
  @UseGuards(JwtAuthGuard)
  async registerAdmin(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.registerAdmin(req.userData, username);
  }

  @ApiOperation({ summary: 'user admin 해제' })
  @ApiForbiddenResponse({
    description: '웹 owner가 아닌 경우 권한 없음 (You are not owner)',
  })
  @ApiNotFoundResponse({
    description: 'admin 해제할 유저의 정보가 없는 경우 (User Not Found)',
  })
  @ApiBadRequestResponse({
    description:
      'owner 자기 자신 admin 해제 불가 (You cannot unregister admin yourself)',
  })
  @Delete('admin/:username')
  @UseGuards(JwtAuthGuard)
  async unregisterAdmin(@Req() req: any, @Param('username') username: string) {
    return await this.usersService.unregisterAdmin(req.userData, username);
  }
}
