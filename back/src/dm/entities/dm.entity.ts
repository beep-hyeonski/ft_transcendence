import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class DM extends BaseEntity {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn()
  index: number;

  @ApiProperty({
    example: '1',
    description: '메세지를 보낸 user index',
  })
  @ManyToOne(() => User)
  @JoinColumn({
    name: 'send_user_index',
    referencedColumnName: 'index',
  })
  sendUser: User;

  @ApiProperty({
    example: '1',
    description: '메세지를 받는 user index',
  })
  @ManyToOne(() => User)
  @JoinColumn({
    name: 'receive_user_index',
    referencedColumnName: 'index',
  })
  receiveUser: User;

  @ApiProperty({
    example: 'Hello Everyone !',
    description: 'DM Content 내용',
  })
  @Column({ type: 'text' })
  message: string;

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
