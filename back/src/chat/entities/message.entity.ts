import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	Column,
	CreateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class Message extends BaseEntity {
	@ApiProperty({
		example: '1',
		description: 'Message 를 특정하는 Index',
	})
	@PrimaryGeneratedColumn()
	index: number;

	@ApiProperty({
		example: '1',
		description: '메시지가 전송 된 채팅방 Index',
	})
	@ManyToOne(() => ChatRoom)
	@JoinColumn({
		name: 'chat_room_index',
		referencedColumnName: 'index',
	})
	chatRoom: ChatRoom;

	@ApiProperty({
		example: '1',
		description: 'Message 를 전송한 User Index'
	})
	@ManyToOne(() => User)
	@JoinColumn({
		name: 'send_users_index',
		referencedColumnName: 'index',
	})
	sendUser: User;

	@ApiProperty({
		example: 'Hello Everyone !',
		description: 'Message Content 내용',
	})
	@Column({
		type: 'text',
	})
	messageContent: String;

	@ApiProperty({
		example: '2021-08-31 23:12:40',
		description: '메시지를 전송한 시간',
	})
	@CreateDateColumn({
		type: 'timestamp',
		name: 'created_at',
		default: () => 'now()',
	})
	createdAt: Date;
}