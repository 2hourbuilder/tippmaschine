import { MatchPointsRule } from "../../../models/competition";
import { Odds, ScoreStats } from "../../../models/match";
import getExpectedGoals from "./getExpectedGoals";
import oddsToAdjProbs from "./oddsToAdjProbs";
import { calculateScoreProbFromPoisson, calculateTeamLambdas } from "./poisson";

const calculateScoreStats = (
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
  const scoreProbs: Array<{
    score: { homeTeam: number; awayTeam: number; diff: number };
    prob: number;
  }> = [];
  for (let hGoals = 0; hGoals <= maxGoals; hGoals++) {
    for (let aGoals = 0; aGoals <= maxGoals; aGoals++) {
      const prob = calculateScoreProbFromPoisson(
        hGoals,
        aGoals,
        teamLambdas.home,
        teamLambdas.away
      );
      if (prob > 0.001) {
        scoreProbs.push({
          score: { homeTeam: hGoals, awayTeam: aGoals, diff: hGoals - aGoals },
          prob: prob,
        });
      }
    }
  }

  const result = scoreProbs.map((e) => {
    let ev = 0;
    if (typeof pointsRule.standardPointsRule !== "undefined") {
      // Home win
      if (e.score.homeTeam > e.score.awayTeam) {
        ev += e.prob * pointsRule.standardPointsRule.homeWin.exact; // exact EV
        scoreProbs
          .filter(
            (s) =>
              s.score.diff === e.score.diff &&
              s.score.homeTeam !== e.score.homeTeam
          )
          .forEach((outcome) => {
            if (pointsRule.standardPointsRule) {
              ev +=
                outcome.prob * pointsRule.standardPointsRule.homeWin.difference;
            }
          });
        scoreProbs
          .filter(
            (s) =>
              s.score.homeTeam > s.score.awayTeam &&
              s.score.diff !== e.score.diff
          )
          .forEach((outcome) => {
            if (pointsRule.standardPointsRule) {
              ev +=
                outcome.prob * pointsRule.standardPointsRule.homeWin.tendency;
            }
          });
      }

      // Draw

      if (e.score.homeTeam === e.score.awayTeam) {
        ev += e.prob * pointsRule.standardPointsRule.draw.exact; // exact EV
        scoreProbs
          .filter(
            (s) =>
              s.score.diff === e.score.diff &&
              s.score.homeTeam !== e.score.homeTeam
          )
          .forEach((outcome) => {
            if (pointsRule.standardPointsRule) {
              ev += outcome.prob * pointsRule.standardPointsRule.draw.tendency;
            }
          });
      }

      // Away win

      if (e.score.homeTeam < e.score.awayTeam) {
        ev += e.prob * pointsRule.standardPointsRule.awayWin.exact; // exact EV
        scoreProbs
          .filter(
            (s) =>
              s.score.diff === e.score.diff &&
              s.score.homeTeam !== e.score.homeTeam
          )
          .forEach((outcome) => {
            if (pointsRule.standardPointsRule) {
              ev +=
                outcome.prob * pointsRule.standardPointsRule.awayWin.tendency;
            }
          });
        scoreProbs
          .filter(
            (s) =>
              s.score.homeTeam < s.score.awayTeam &&
              s.score.diff !== e.score.diff
          )
          .forEach((outcome) => {
            if (pointsRule.standardPointsRule) {
              ev +=
                outcome.prob * pointsRule.standardPointsRule.awayWin.tendency;
            }
          });
      }
    }
    return { score: e.score, prob: e.prob, ev: ev } as ScoreStats;
  });
  return result;
};

export default calculateScoreStats;
