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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '전체 채팅 조회' })
  @ApiOkResponse({
    description: '전체 채팅 배열',
    type: Chat,
    isArray: true,
  })
  @Get()
  async getChats() {
    return await this.chatService.getChats();
  }

  @ApiOperation({ summary: '채팅방 개설' })
  @ApiCreatedResponse({
    description: '개설된 채팅 정보',
    type: Chat,
  })
  @Post()
  async createChat(@Req() req: any, @Body() createChatDto: CreateChatDto) {
    return await this.chatService.createChat(req.user, createChatDto);
  }

  @ApiOperation({ summary: '특정 채팅방 정보 조회' })
  @ApiOkResponse({ type: Chat })
  @Get(':chatIndex')
  async getChat(@Param('chatIndex') chatIndex: number) {
    return await this.chatService.getChat(chatIndex);
  }

  @ApiOperation({ summary: '채팅방 정보 변경(제목, 상태, 비밀번호)' })
  @ApiOkResponse({
    description: '변경된 채팅 정보',
    type: Chat,
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
  @Delete(':chatIndex')
  async deleteChat(@Req() req: any, @Param('chatIndex') chatIndex: number) {
    return await this.chatService.deleteChat(req.user, chatIndex);
  }

  @ApiOperation({ summary: '채팅방 입장' })
  @ApiCreatedResponse({ type: Chat })
  @Post(':chatIndex/join')
  async joinChat(@Req() req: any, @Param('chatIndex') chatIndex: number) {
    return await this.chatService.joinChat(req.user, chatIndex);
  }

  @ApiOperation({ summary: '채팅방 퇴장' })
  @Post(':chatIndex/leave')
  async leaveChat(@Req() req: any, @Param('chatIndex') chatIndex: number) {
    return await this.chatService.leaveChat(req.user, chatIndex);
  }

  @ApiOperation({ summary: 'Admin User 등록' })
  @ApiCreatedResponse({
    description: 'Admin이 등록된 채팅 정보',
    type: Chat,
  })
  @Post(':chatIndex/admin')
  async registerAdmin(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.registerAdmin(req.user, chatIndex, username);
  }

  @ApiOperation({ summary: 'Admin User 제거' })
  @Delete(':chatIndex/admin')
  async unRegisterAdmin(
    @Req() req: any,
    @Param('chatIndex') chatIndex: number,
    @Body('username') username: string,
  ) {
    return await this.chatService.unRegisterAdmin(
      req.user,
      chatIndex,
      username,
    );
  }

  @ApiOperation({ summary: 'Mute User 등록' })
  @ApiCreatedResponse({
    description: 'User를 mute한 채팅 정보',
    type: Chat,
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
  @ApiCreatedResponse({
    description: 'User를 ban한 채팅 정보',
    type: Chat,
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

  @ApiOperation({ summary: '채팅방에 전송 된 메시지 리스트' })
  @ApiOkResponse({
    type: Message,
    isArray: true,
  })
  @Get(':chatIndex/messages')
  async getMessages(@Param('chatIndex') chatIndex: number) {
    return await this.chatService.getMessages(chatIndex);
  }
}
