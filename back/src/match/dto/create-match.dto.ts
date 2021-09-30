import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({
    description: 'Player 1 Index',
    example: '1',
  })
  @IsNumber()
  player1Index: number;

  @ApiProperty({
    description: 'Player 2 Index',
    example: '2',
  })
  @IsNumber()
  player2Index: number;

  @ApiProperty({
    description: 'Player 1 score',
    example: '42',
  })
  @IsNumber()
  player1Score: number;

  @ApiProperty({
    description: 'Player 2 score',
    example: '42',
  })
  @IsNumber()
  player2Score: number;
}
