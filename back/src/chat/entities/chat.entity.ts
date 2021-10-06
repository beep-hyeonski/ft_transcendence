import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Message } from './message.entity';

export enum ChatStatus {
  PUBLIC = 'public',
  PROTECTED = 'protected',
}

@Entity()
export class Chat extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'Chat을 특정하는 Index',
  })
  @PrimaryGeneratedColumn()
  index: number;

  @ApiProperty({
    example: 'Go Chatting!',
    description: '채팅방 제목',
  })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({
    example: '1',
    description: '채팅방 개설자 user index',
  })
  @ManyToOne(() => User)
  @JoinColumn({
    name: 'owner_user_index',
    referencedColumnName: 'index',
  })
  ownerUser: User;

  @ApiProperty({
    example: '[1, 2]',
    description: '채팅방 admin user index 리스트',
  })
  @ManyToMany(() => User, (user) => user.adminChannels)
  @JoinTable({
    name: 'admin_users',
    joinColumn: {
      name: 'admin_users',
      referencedColumnName: 'index',
    },
    inverseJoinColumn: {
      name: 'admin_channels',
      referencedColumnName: 'index',
    },
  })
  adminUsers: User[];

  @ApiProperty({
    example: '[3, 4]',
    description: '채팅방에 참가하고 있는 User index 리스트',
  })
  @ManyToMany(() => User, (users) => users.joinChannels)
  @JoinTable({
    name: 'join_users',
    joinColumn: {
      name: 'join_channels',
      referencedColumnName: 'index',
    },
    inverseJoinColumn: {
      name: 'join_users',
      referencedColumnName: 'index',
    },
  })
  joinUsers: User[];

  @ApiProperty({
    example: '[2, 3]',
    description: '현재 채팅방에서 Mute 된 User Index List',
  })
  @ManyToMany(() => User, (users) => users.mutedChannels)
  @JoinTable({
    name: 'muted_users',
    joinColumn: {
      name: 'muted_users',
      referencedColumnName: 'index',
    },
    inverseJoinColumn: {
      name: 'muted_channels',
      referencedColumnName: 'index',
    },
  })
  mutedUsers: User[];

  @ApiProperty({
    example: '[3, 4]',
    description: '현재 채팅방에서 Ban 된 User Index List',
  })
  @ManyToMany(() => User, (users) => users.bannedChannels)
  @JoinTable({
    name: 'banned_users',
    joinColumn: {
      name: 'banned_users',
      referencedColumnName: 'index',
    },
    inverseJoinColumn: {
      name: 'banned_channels',
      referencedColumnName: 'index',
    },
  })
  bannedUsers: User[];

  @ApiProperty()
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @ApiProperty({
    example: 'public',
    description: '채팅방 접근 권한을 나타낸다.',
  })
  @Column({
    type: 'enum',
    name: 'status',
    enum: ChatStatus,
    default: ChatStatus.PUBLIC,
  })
  status: ChatStatus;

  @ApiProperty({
    example: '1234',
    description: '채널 접근 권한이 protected 일 경우 Password 설정',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  password: string;

  @ApiProperty({
    example: '2021-08-31 22:56:23',
    description: 'Chat 생성 시간',
  })
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
