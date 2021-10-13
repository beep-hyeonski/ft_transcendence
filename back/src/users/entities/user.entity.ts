import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chat/entities/chat.entity';
import { Message } from 'src/chat/entities/message.entity';

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  INQUEUE = 'inqueue',
  INGAME = 'ingame',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  OWNER = 'owner',
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'db 추가 시 자동 부여되는 숫자',
  })
  @PrimaryGeneratedColumn()
  index: number;

  @ApiProperty({
    example: 'hyeonski',
    description: 'user 고유 ID, intra42 ID 사용',
  })
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  username: string;

  @ApiProperty({
    example: 'goodhyeonski',
    description: '서비스에서 보여질 unique name',
  })
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  nickname: string;

  @ApiProperty({
    example: 'hyeonski@student.42seoul.kr',
    description: '이메일',
  })
  @Column({
    type: 'varchar',
    length: 150,
  })
  email: string;

  @ApiProperty({
    example: 'https://cdn.intra.42.fr/users/hyeonki.jpg',
    description: 'user의 프로필 이미지, 기본 이미지는 intra42 사진',
  })
  @Column({
    type: 'text',
  })
  avatar: string;

  @ApiProperty({
    example: '[juyang, jayun, joockim]',
    description: 'user를 팔로우하는 다른 users',
  })
  @ManyToMany(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'follow',
    joinColumn: {
      name: 'followed',
      referencedColumnName: 'index',
    },
    inverseJoinColumn: {
      name: 'follower',
      referencedColumnName: 'index',
    },
  })
  followers: User[];

  @ApiProperty({
    example: '[juyang, jayun, joockim]',
    description: 'user가 팔로우하는 다른 users',
  })
  @ManyToMany(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  followings: User[];

  @ApiProperty({
    example: '[bad1, bad2, bad3]',
    description: 'user를 차단한 다른 users',
  })
  @ManyToMany(() => User, (user) => user.blockings, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'block',
    joinColumn: {
      name: 'blocker',
      referencedColumnName: 'index',
    },
    inverseJoinColumn: {
      name: 'blocked',
      referencedColumnName: 'index',
    },
  })
  blockers: User[];

  @ApiProperty({
    example: '[bad1, bad2, bad3]',
    description: 'user가 차단한 다른 users',
  })
  @ManyToMany(() => User, (user) => user.blockers, { onDelete: 'CASCADE' })
  blockings: User[];

  @ApiProperty({
    example: '2000',
    description: '게임 승리 시 올라가는 점수',
  })
  @Column({
    type: 'int',
    default: '0',
  })
  score: number;

  @ApiProperty({
    example: '4',
    description: '게임 승리 횟수',
  })
  @Column({
    type: 'int',
    default: '0',
  })
  victory: number;

  @ApiProperty({
    example: '5',
    description: '게임 패배 횟수',
  })
  @Column({
    type: 'int',
    default: '0',
  })
  defeat: number;

  @ApiProperty({
    example: '[1, 2, 3]',
    description: 'owner 로 참가하고 있는 채팅방 INDEX 리스트',
  })
  @OneToMany(() => Chat, (ownerChannels) => ownerChannels.ownerUser)
  ownerChannels: Chat[];

  @ApiProperty({
    example: '[1, 2, 3]',
    description: 'admin 으로 참가하고 있는 채팅방 index 리스트',
  })
  @ManyToMany(() => Chat, (adminChannels) => adminChannels.adminUsers)
  adminChannels: Chat[];

  @ApiProperty({
    example: '[2, 3]',
    description: '현재 참가하고 있는 채널 리스트',
  })
  @ManyToMany(() => Chat, (joinChannels) => joinChannels.joinUsers)
  joinChannels: Chat[];

  @ApiProperty({
    example: '[1, 2]',
    description: '현재 Mute 처리 된 채널 Index 리스트',
  })
  @ManyToMany(() => Chat, (mutedChannels) => mutedChannels.mutedUsers)
  mutedChannels: Chat[];

  @ApiProperty({
    example: '[1, 3]',
    description: '현재 Ban 처리 된 채널 Index 리스트',
  })
  @ManyToMany(() => Chat, (bannedChannels) => bannedChannels.bannedUsers)
  bannedChannels: Chat[];

  @ApiProperty({
    example: '[1, 2, 3]',
    description: 'User 가 전송한 메시지 Index 리스트',
  })
  @OneToMany(() => Message, (sendMessages) => sendMessages.sendUser)
  sendMessages: Message[];

  @ApiProperty({
    example: 'true',
    description: '2-factor 인증 사용 여부, true/false',
  })
  @Column({
    name: 'use_twofa',
    type: 'boolean',
    default: false,
  })
  useTwoFA: boolean;

  @ApiProperty({
    example: 'abcdef',
    description: '2-Factor Token 저장',
  })
  @Column({
    name: 'twofa_token',
    type: 'text',
    nullable: true,
  })
  twoFAToken: string;

  @ApiProperty({
    example: 'online',
    description: '유저의 접속 상태, online/game/offline',
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ONLINE,
  })
  status: UserStatus;

  @ApiProperty({
    example: 'admin',
    description: '유저의 역할, owner/admin/user',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    example: 'true',
    description: '유저의 ban 여부',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  isBanned: boolean;

  @ApiProperty({
    example: '2021-03-18 00:00:00',
    description: 'user 생성 시간',
  })
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
