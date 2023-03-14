import { ScoreStats } from "../../models/match";

const calcPointsForTip = (
  tip: { away: number; home: number },
  score: { away: number | null; home: number | null },
  pointsRule: {
    homeWin: {
      tendency: number;
      difference: number;
      exact: number;
    };
    draw: {
      tendency: number;
      exact: number;
    };
    awayWin: {
      tendency: number;
      difference: number;
      exact: number;
    };
  }
) => {
  if (!score.away || !score.home) {
    return 0;
  }
  //homewin
  if (score.home > score.away) {
    if (tip.home === score.home && tip.away === score.away) {
      return pointsRule.homeWin.exact;
    }
    if (tip.home - tip.away === score.home - score.away) {
      return pointsRule.homeWin.difference;
    }
    if (tip.home > tip.away) {
      return pointsRule.homeWin.tendency;
    }
  }
  //awaywin
  if (score.home < score.away) {
    if (tip.home === score.home && tip.away === score.away) {
      return pointsRule.awayWin.exact;
    }
    if (tip.home - tip.away === score.home - score.away) {
      return pointsRule.awayWin.difference;
    }
    if (tip.home < tip.away) {
      return pointsRule.awayWin.tendency;
    }
  }
  //draw
  if (score.home === score.away) {
    if (tip.home === score.home && tip.away === score.away) {
      return pointsRule.draw.exact;
    }
    if (tip.home === tip.away) {
      return pointsRule.draw.tendency;
    }
  }
  // else return 0
  return 0;
};

export const calcPointDistribution = (
  tip: { away: number; home: number },
  scoreStats: ScoreStats[],
  pointsRule: {
    homeWin: {
      tendency: number;
      difference: number;
      exact: number;
    };
    draw: {
      tendency: number;
      exact: number;
    };
    awayWin: {
      tendency: number;
      difference: number;
      exact: number;
    };
  }
) => {
  const probSum = scoreStats.reduce((prev, curr) => prev + curr.prob, 0);
  const resultDist: Array<{ points: number; prob: number }> = [];
  if (probSum === 0) {
    return resultDist;
  }
  scoreStats.forEach((score) => {
    const points = calcPointsForTip(
      tip,
      { home: score.score.homeTeam, away: score.score.awayTeam },
      pointsRule
    );
    const exists = resultDist.findIndex((e) => e.points === points);
    if (exists >= 0) {
      resultDist[exists].prob += score.prob / probSum;
    } else {
      resultDist.push({
        points: points,
        prob: score.prob / probSum,
      });
    }
  });
  return resultDist;
};
