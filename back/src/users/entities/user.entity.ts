import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
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
    example: '2021-03-18 00:00:00',
    description: 'user 생성 시간',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
  })
  created_at: Date;
}
