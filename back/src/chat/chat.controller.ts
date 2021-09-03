import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {

	}

	@ApiOperation({ summary: '전체 채팅 조회'})
	@ApiOkResponse({

	})
	@Get()
	getChats() {
		return this.chatService.getChats();
	}

	@ApiOperation({ summary: '채팅방 개설'})
	@ApiOkResponse({

	})
	@Post()
	async createChat(@Req() req: any, @Body() createChatDto: CreateChatDto) {
		return await this.chatService.createChat(req.user, createChatDto);
	}

	@ApiOperation({ summary: '특정 채팅방 정보 조회'})
	@ApiOkResponse({

	})
	@Get(':chatIndex')
	getChat(@Param('chatIndex') chatIndex: number) {
		return this.chatService.getChat(chatIndex);
	}

	@ApiOperation({ summary: '채팅방 정보 변경'})
	@ApiOkResponse({

	})
	@Patch(':chatIndex')
	updateChat(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body() updateChatDto: UpdateChatDto,
	) {
		return this.chatService.updateChat(req.user, chatIndex, updateChatDto);
	}

	@ApiOperation({ summary: '채팅방 삭제' })
	@ApiOkResponse({

	})
	@Delete(':chatIndex')
	deleteChat(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
	) {
		return this.chatService.deleteChat(req.user, chatIndex);
	}

	@ApiOperation({ summary: '채팅방 입장' })
	@ApiOkResponse({

	})
	@Post(':chatIndex/join')
	joinChat(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
	) {
		return this.chatService.joinChat(req.user, chatIndex);
	}

	@ApiOperation({ summary: '채팅방 퇴장' })
	@ApiOkResponse({

	})
	@Post(':chatIndex/leave')
	leaveChat(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
	) {
		
	}

	@ApiOperation({ summary: 'Admin User 등록' })
	@ApiOkResponse({

	})
	@Post(':chatIndex/admin')
	registerAdmin(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body('username') username: string,
	) {
		return this.chatService.registerAdmin(req.user, chatIndex, username);
	}

	@ApiOperation({ summary: 'Admin User 제거' })
	@ApiOkResponse({

	})
	@Delete(':chatIndex/admin')
	unRegisterAdmin(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body('username') username: string,
	) {
		return this.chatService.unRegisterAdmin(req.user, chatIndex, username);
	}

	@ApiOperation({ summary: 'Mute User 등록' })
	@ApiOkResponse({

	})
	@Post(':chatIndex/mute')
	registerMuteUser(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body('username') username: string,
	) {
		return this.chatService.registerMuteUser(req.user, chatIndex, username);
	}

	@ApiOperation({ summary: 'Mute User 제거' })
	@ApiOkResponse({
		
	})
	@Delete(':chatIndex/mute')
	unRegisterMuteUser(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body('username') username: string,
	) {
		return this.chatService.unRegisterMuteUser(req.user, chatIndex, username);
	}

	@ApiOperation({ summary: 'Ban User 등록' })
	@ApiOkResponse({

	})
	@Post(':chatIndex/ban')
	registerBanUser(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body('username') username: string,
	) {
		return this.chatService.registerBanUser(req.user, chatIndex, username);
	}

	@ApiOperation({ summary: 'Ban User 해제' })
	@ApiOkResponse({

	})
	@Delete(':chatIndex/ban')
	unRegisterBanUser(
		@Req() req: any,
		@Param('chatIndex') chatIndex: number,
		@Body('username') username: string,
	) {
		return this.chatService.unRegisterBanUser(req.user, chatIndex, username);
	}

	@ApiOperation({ summary: '채팅방에 전송 된 메시지 리스트' })
	@ApiOkResponse({

	})
	@Get(':chatIndex/messages')
	getMessages(
		@Param('chatIndex') chatIndex: number,
	) {
		return this.chatService.getMessages(chatIndex);
	}
}
