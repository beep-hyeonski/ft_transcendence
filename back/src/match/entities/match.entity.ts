import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Match extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'Match 를 특정하는 Index',
  })
  @PrimaryGeneratedColumn()
  index: number;

  @ApiProperty({
    example: '1',
    description: 'winner 의 index',
  })
  @JoinColumn({
    name: 'winner_user_index',
    referencedColumnName: 'index',
  })
  @ManyToOne(() => User)
  winner: User;

  @ApiProperty({
    example: '2',
    description: 'loser 의 index',
  })
  @JoinColumn({
    name: 'loser_user_index',
    referencedColumnName: 'index',
  })
  @ManyToOne(() => User)
  loser: User;

  @ApiProperty({
    example: '42',
    description: 'winner 의 score',
  })
  @Column({
    type: 'int',
    default: '0',
  })
  winnerScore: number;

  @ApiProperty({
    example: '0',
    description: 'loser 의 score',
  })
  @Column({
    type: 'int',
    default: '0',
  })
  loserScore: number;

  @ApiProperty({
    example: '2021-09-08 19:41:30',
    description: 'Match Data 생성 시간',
  })
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
