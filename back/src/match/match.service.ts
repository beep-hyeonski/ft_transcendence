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

    try {
      await getManager().transaction(async (transactionalEntityManager) => {

        if (createMatchDto.player1Score > createMatchDto.player2Score) {
          await getConnection().createQueryBuilder().update(User)
          .set({
            victory: () => 'victory + 1',
            score: () => 'score + 10',
          }).where("id = :id", { id: createMatchDto.player1Index }).execute();
          await getConnection().createQueryBuilder().update(User)
          .set({
            defeat: () => 'defeat + 1',
            score: () => 'score - 10',
          }).where("id = :id", { id: createMatchDto.player2Index }).execute();

          createMatch.winner = player1;
          createMatch.loser = player2;
          createMatch.winnerScore = createMatchDto.player1Score;
          createMatch.loserScore = createMatchDto.player2Score;
        } else {
          await getConnection().createQueryBuilder().update(User)
          .set({
            victory: () => 'victory + 1',
            score: () => 'score + 10',
          }).where("id = :id", { id: createMatchDto.player2Index }).execute();
          await getConnection().createQueryBuilder().update(User)
          .set({
            defeat: () => 'defeat + 1',
            score: () => 'score - 10',
          }).where("id = :id", { id: createMatchDto.player1Index }).execute();
          createMatch.winner = player2;
          createMatch.loser = player1;
          createMatch.winnerScore = createMatchDto.player2Score;
          createMatch.loserScore = createMatchDto.player1Score;
        }
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
