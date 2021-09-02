import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ChatRoomStatus } from "../entities/chat-room.entity";

export class UpdateChatDto {
	@ApiProperty({ description: 'Chat Title', example: 'Come in without Juyang!' })
	@IsOptional()
	@IsString()
	title: string;

	@ApiProperty({ description: 'Chat Status', example: 'protected'})
	@IsOptional()
	@IsEnum(ChatRoomStatus)
	status: ChatRoomStatus;

	@ApiProperty({ description: 'Protected 채널일 경우 입장 Password', example: 'a1b2c3' })
	@IsOptional()
	@IsString()
	@MaxLength(20, {
		message: 'Invaid Password Length',
	})
	password: string;
}