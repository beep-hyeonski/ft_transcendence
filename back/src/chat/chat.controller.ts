import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '전체 채팅 조회' })
  @ApiOkResponse({ description: '전체 채팅 배열, owner, joinUser 정보 포함' })
  @Get()
  async getChats() {
    return await this.chatService.getChats();
  }

  @ApiOperation({ summary: '채팅방 개설' })
  @ApiCreatedResponse({ description: '개설된 채팅 정보' })
  @ApiNotFoundResponse({ description: '등록되지 않은 유저 (Not Found)' })
  @ApiBadRequestResponse({
    description:
      '패스워드 없이 protected 채널 개설 불가 (Password Required) ||\
      password가 있는 public 채널 개설 불가 (Invalid Chat Status)',
  })
  @Post()
  async createChat(@Req() req: any, @Body() createChatDto: CreateChatDto) {
    return await this.chatService.createChat(req.user, createChatDto);
  }

  @ApiOperation({ summary: '특정 채팅방 정보 조회' })
  @ApiOkResponse({ description: '채팅방 정보, 참여 유저, 차단 유저 등 응답' })
  @ApiNotFoundResponse({
    description: 'index에 해당하는 채팅방 없음 (Not Found)',
  })
  @Get(':chatIndex')
  async getChat(@Param('chatIndex') chatIndex: number) {
    return await this.chatService.getChat(chatIndex);
  }

  @ApiOperation({ summary: '채팅방 정보 변경(제목, 상태, 비밀번호)' })
  @ApiOkResponse({ description: '변경된 채팅 정보' })
  @ApiNotFoundResponse({ description: '변경할 채팅 없음 (Not Found)' })
  @ApiForbiddenResponse({
    description: '채팅 owner가 아닐 경우 변경 권한 없음 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description:
      'public 채널에 password 변경 불가 (Do Not set Password if not protected) ||\
      protect로 변경할 때 8자 이상 20자 이하 비밀번호 필요 (Valid 8 ~ 20 Characters of Password Required) ||\
      protect 유지하면서 비밀번호 변경할 때 8자 이상 20자 이하 비밀번호 필요 (Valid 8 ~ 20 Characters of Password Required)',
  })
  @Patch(':chatIndex')
  async updateChat(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return await this.chatService.updateChat(
      req.user,
      chatIndex,
      updateChatDto,
    );
  }

  @ApiOperation({ summary: '채팅방 삭제' })
  @ApiOkResponse({ description: '삭제된 chat 정보' })
  @ApiForbiddenResponse({
    description:
      '웹 owner 또는 admin이 아닐 경우 권한 없음 (Permission Denied)',
  })
  @ApiNotFoundResponse({ description: 'chat 없음 (Not Found)' })
  @Delete(':chatIndex')
  async deleteChat(@Req() req: any, @Param('chatIndex') chatIndex: number) {
    return await this.chatService.deleteChat(req.userData, chatIndex);
  }

  @ApiOperation({ summary: '채팅방 참여' })
  @ApiCreatedResponse({ description: '참여한 채팅 정보' })
  @ApiNotFoundResponse({ description: '참여할 채팅 없음 (Not Found)' })
  @ApiBadRequestResponse({
    description:
      '이미 참여한 유저 (Already joined user) ||\
      채널에서 ban된 유저 (User Banned) ||\
      protected 채널이나 비밀번호가 입력되지 않음 (Password Required) ||\
      protected 채널에 비밀번호가 일치하지 않음 (Invalid Password)',
  })
  @Post(':chatIndex/join')
  async joinChat(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('password') password: string,
  ) {
    return await this.chatService.joinChat(req.userData, chatIndex, password);
  }

  @ApiOperation({ summary: '채팅방 퇴장' })
  @ApiCreatedResponse({
    description:
      '퇴장한 채팅 정보 응답, owner가 퇴장시 무작위 참여자를 owner로 설정, 마지막 유저 퇴장 시 채팅 삭제',
  })
  @ApiNotFoundResponse({ description: '퇴장할 채팅 없음 (Not Found)' })
  @ApiBadRequestResponse({
    description: '참여한 채팅 아님 (User Not Entered this chat)',
  })
  @Post(':chatIndex/leave')
  async leaveChat(@Req() req: any, @Param('chatIndex') chatIndex: number) {
    return await this.chatService.leaveChat(req.userData, chatIndex);
  }

  @ApiOperation({ summary: 'Admin User 등록' })
  @ApiCreatedResponse({ description: 'Admin이 등록된 채팅 정보' })
  @ApiNotFoundResponse({
    description:
      'Admin으로 등록할 유저 없음 (Not Found) ||\
      Admin을 등록할 채팅 없음 (Not Found) ',
  })
  @ApiForbiddenResponse({
    description:
      'Chat owner 또는 웹사이트 admin이 아닐 경우 권한 없음 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description:
      '채팅방에 입장하지 않은 유저 Admin으로 등록 불가 (User is not in the chat) ||\
      유저가 이미 Admin임 (User is already admin)',
  })
  @Post(':chatIndex/admin')
  async registerAdmin(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.registerAdmin(
      req.userData,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: 'Admin User 제거' })
  @ApiOkResponse({ description: 'Admin 제거한 채팅 정보' })
  @ApiNotFoundResponse({
    description:
      'Admin 제거할 유저 없음 (Not Found) ||\
      Admin 제거할 채널 없음 (Not Found)',
  })
  @ApiForbiddenResponse({
    description:
      'Chat owner 또는 웹사이트 admin이 아닐 경우 권한 없음 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description:
      'Admin 제거할 유저가 Admin이 아님 (User is not admin) ||\
      Chat owner의 admin 권한 제거 불가능 (Owner cannot be removed from admin)',
  })
  @Delete(':chatIndex/admin')
  async unRegisterAdmin(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.unRegisterAdmin(
      req.userData,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: 'Mute User 등록' })
  @ApiCreatedResponse({ description: 'User를 mute한 채팅 정보' })
  @ApiNotFoundResponse({
    description:
      'Mute할 유저 없음 (Not Found) ||\
      Mute를 등록할 채널 없음 (Not Found)',
  })
  @ApiForbiddenResponse({
    description: 'Chat admin이 아닐 경우 권한 없음 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description:
      'Chat owner나 admin mute 불가 (Impossible to mute owner or admin) ||\
      이미 mute된 유저 (User have already been muted) ||\
      chat에 참여하고 있지 않은 user (User is not in the chat)',
  })
  @Post(':chatIndex/mute')
  async registerMuteUser(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.registerMuteUser(
      req.user,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: 'Mute User 제거' })
  @ApiOkResponse({ description: 'mute를 제거한 채팅 정보' })
  @ApiNotFoundResponse({
    description:
      'mute 해제할 유저 없음 (Not Found) ||\
    mute 제거할 채팅 없음 (Not Found)',
  })
  @ApiForbiddenResponse({
    description: 'Chat admin이 아닐 경우 mute 해제 불가 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description: 'mute되지 않은 유저 mute 해제 불가 (User have not been muted)',
  })
  @Delete(':chatIndex/mute')
  async unRegisterMuteUser(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.unRegisterMuteUser(
      req.user,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: 'Ban User 등록' })
  @ApiCreatedResponse({ description: 'User를 ban한 채팅 정보' })
  @ApiNotFoundResponse({
    description:
      'Ban할 유저 없음 (Not Found) ||\
    Ban을 등록할 채팅 없음 (Not Found)',
  })
  @ApiForbiddenResponse({
    description: 'Chat admin이 아닐 경우 ban 등록 불가 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description:
      'Chat owner 또는 admin을 ban 불가 (Impossible to ban owner or admin) ||\
      이미 ban된 유저 (User have already been banned) ||\
      채널에 참여하지 않는 유저 ban 불가 (User is not in the chat)',
  })
  @Post(':chatIndex/ban')
  async registerBanUser(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.registerBanUser(
      req.user,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: 'Ban User 해제' })
  @ApiCreatedResponse({ description: 'User ban 해제한 채팅 정보' })
  @ApiNotFoundResponse({
    description:
      'Ban 해제할 유저 없음 (Not Found) ||\
      Ban 등록 해제할 채팅 없음 (Not Found)',
  })
  @ApiForbiddenResponse({
    description: 'Chat admin이 아닐 경우 ban 해제 불가 (Permission Denied)',
  })
  @ApiBadRequestResponse({
    description: 'ban 되지 않은 유저 해제 불가 (User have not been banned)',
  })
  @Delete(':chatIndex/ban')
  async unRegisterBanUser(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.unRegisterBanUser(
      req.user,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: '채널에 전송 된 메시지 리스트 조회' })
  @ApiOkResponse({ description: '채널의 메세지 리스트 시간 오름차순으로 응답' })
  @ApiNotFoundResponse({ description: '조회할 채팅 없음 (Not Found)' })
  @ApiForbiddenResponse({
    description:
      '웹사이트 admin이 아니거나 채팅에 참여하지 않은 경우 권한 없음 (Permission Denied)',
  })
  @Get(':chatIndex/messages')
  async getMessages(@Param('chatIndex') chatIndex: number, @Req() req: any) {
    return await this.chatService.getMessages(req.userData, chatIndex);
  }
}
