import { ScoreProb, MatchPointsRule } from "../../../models/competition";
import { Odds } from "../../../models/match";
import getExpectedGoals from "./getExpectedGoals";
import oddsToAdjProbs from "./oddsToAdjProbs";
import { calculateScoreProbFromPoisson, calculateTeamLambdas } from "./poisson";

const calculateScoreProbs = (
  odds: Odds | null,
  pointsRule: MatchPointsRule | undefined,
  maxGoals: number
) => {
  if (odds === null || typeof pointsRule?.standardPointsRule === "undefined") {
    return null;
  }

  const expectedGoals = odds.overUnder ? getExpectedGoals(odds.overUnder) : 3;
  const [homeWin, draw, awayWin] = oddsToAdjProbs([
    odds.matchWinner.homeWin,
    odds.matchWinner.draw,
    odds.matchWinner.awayWin,
  ]);
  const teamLambdas = calculateTeamLambdas(expectedGoals, {
    home: homeWin,
    draw: draw,
    away: awayWin,
  });
  const results: Array<ScoreProb> = [];
  for (let hGoals = 0; hGoals <= maxGoals; hGoals++) {
    for (let aGoals = 0; aGoals <= maxGoals; aGoals++) {
      const prob = calculateScoreProbFromPoisson(
        hGoals,
        aGoals,
        teamLambdas.home,
        teamLambdas.away
      );
      if (prob > 0.001) {
        results.push({
          score: { homeTeam: hGoals, awayTeam: aGoals },
          prob: prob,
        });
      }
    }
  }
  return results;
};

export default calculateScoreProbs;
