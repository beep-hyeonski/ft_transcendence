import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { getManager, Repository, TypeORMError } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

  async getMatches() {
    return await this.matchRepository.find({
      relations: ['winner', 'loser'],
      order: {
        'createdAt': 'DESC',
      },
    });
  }

  async createMatch(createMatchDto: CreateMatchDto) {
    const player1 = await this.userRepository.findOneOrFail({
      where: { index: createMatchDto.player1Index },
    });

    const player2 = await this.userRepository.findOneOrFail({
      where: { index: createMatchDto.player2Index },
    });

    const createMatch = new Match();

    if (createMatchDto.player1Score > createMatchDto.player2Score) {
      player1.victory = player1.victory + 1;
      player1.score = player1.score + 10;
      player2.defeat = player2.defeat + 1;
      player2.score = player2.score - 10;
      createMatch.winner = player1;
      createMatch.loser = player2;
      createMatch.winnerScore = createMatchDto.player1Score;
      createMatch.loserScore = createMatchDto.player2Score;
    } else {
      player2.victory = player2.victory + 1;
      player2.score = player2.score + 10;
      player1.defeat = player1.defeat + 1;
      player1.score = player1.score - 10;
      createMatch.winner = player2;
      createMatch.loser = player1;
      createMatch.winnerScore = createMatchDto.player2Score;
      createMatch.loserScore = createMatchDto.player1Score;
    }

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(player1);
        await transactionalEntityManager.save(player2);
        await transactionalEntityManager.save(createMatch);
      });
    } catch (e) {
      throw new TypeORMError('Transaction Error');
    }
    return createMatch;
  }

  async getMatch(username: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });

    return await this.matchRepository.find({
      where: [{ winner: user.index }, { loser: user.index }],
      relations: ['winner', 'loser'],
      order: {
        'createdAt': 'DESC',
      },
    });
  }
}
