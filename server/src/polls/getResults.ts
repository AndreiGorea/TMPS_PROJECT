import { Nominations, Rankings, Results } from 'shared';

// Define an interface for the result calculation strategy
interface ResultCalculationStrategy {
  calculate(
    rankings: Rankings,
    nominations: Nominations,
    votesPerVoter: number,
  ): Results;
}

// Implement a specific strategy for result calculation
class DefaultResultCalculationStrategy implements ResultCalculationStrategy {
  calculate(
    rankings: Rankings,
    nominations: Nominations,
    votesPerVoter: number,
  ): Results {
    const scores: { [nominationID: string]: number } = {};

    Object.values(rankings).forEach((userRankings) => {
      userRankings.forEach((nominationID, n) => {
        const voteValue = Math.pow(
          (votesPerVoter - 0.5 * n) / votesPerVoter,
          n + 1,
        );
        scores[nominationID] = (scores[nominationID] ?? 0) + voteValue;
      });
    });

    const results = Object.entries(scores).map(([nominationID, score]) => ({
      nominationID,
      nominationText: nominations[nominationID].text,
      score,
    }));

    results.sort((res1, res2) => res2.score - res1.score);

    return results;
  }
}

// Alternative score calculator strategy
class AlternativeScoreCalculator implements ResultCalculationStrategy {
  calculate(
    rankings: Rankings,
    nominations: Nominations,
    votesPerVoter: number,
  ): Results {
    const scores: { [nominationID: string]: number } = {};

    Object.values(rankings).forEach((userRankings) => {
      userRankings.forEach((nominationID, n) => {
        const voteValue = (votesPerVoter - n) / votesPerVoter;
        scores[nominationID] = (scores[nominationID] ?? 0) + voteValue;
      });
    });

    const results = Object.entries(scores).map(([nominationID, score]) => ({
      nominationID,
      nominationText: nominations[nominationID].text,
      score,
    }));

    results.sort((res1, res2) => res2.score - res1.score);

    return results;
  }
}


// Context class that uses the strategy
export default class ResultsCalculator {
  private strategy: ResultCalculationStrategy;

  constructor(
    strategy: ResultCalculationStrategy = new DefaultResultCalculationStrategy(),
  ) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ResultCalculationStrategy) {
    this.strategy = strategy;
  }
  
  calculate(
    rankings: Rankings,
    nominations: Nominations,
    votesPerVoter: number,
  ): Results {
    return this.strategy.calculate(rankings, nominations, votesPerVoter);
  }
}
