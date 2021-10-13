import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { getConnection, getManager, Repository, TypeORMError } from 'typeorm';
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
        createdAt: 'DESC',
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

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const { player1Score, player2Score } = createMatchDto;
        const winner = player1Score > player2Score ? player1 : player2;
        const loser = player1Score > player2Score ? player2 : player1;
        const updater = getConnection().createQueryBuilder().update(User);

        await updater
          .set({
            victory: () => 'victory + 1',
            score: () => 'score + 10',
          })
          .where('index = :index', { index: winner.index })
          .execute();
        await updater
          .set({
            defeat: () => 'defeat + 1',
            score: () => 'score - 10',
          })
          .where('index = :index', { index: loser.index })
          .execute();

        createMatch.winner = winner;
        createMatch.loser = loser;
        createMatch.winnerScore =
          player1Score > player2Score ? player1Score : player2Score;
        createMatch.loserScore =
          player1Score > player2Score ? player2Score : player1Score;
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
        createdAt: 'DESC',
      },
    });
  }
}
