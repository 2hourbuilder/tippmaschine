export const poisson = (lambda: number, x: number, cumulative: boolean) => {
  const factorialX = (num: number): number => {
    if (num == 0) return 1;
    else return num * factorialX(num - 1);
  };

  if (cumulative) {
    let cumulativeProbability = 0;
    for (let index = 0; index <= x; index++) {
      cumulativeProbability +=
        (Math.exp(-lambda) * Math.pow(lambda, index)) / factorialX(index);
    }
    return cumulativeProbability;
  } else {
    return (Math.exp(-lambda) * Math.pow(lambda, x)) / factorialX(x);
  }
};

export const findLambda = (
  // x1: low estimate for lambda
  // x2: high estimate for lambda
  // xValue: point on the distribution
  // cumulative probability up to xValue
  x1: number,
  x2: number,
  xValue: number,
  cumProb: number
) => {
  const E = 0.01;
  const f = (lambda: number) => {
    const f = poisson(lambda, xValue, true) - cumProb;
    return f;
  };
  let xm;
  let x0;
  let c;
  if (f(x1) * f(x2) < 0) {
    do {
      // calculate the intermediate value
      x0 = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));

      // check if x0 is root of equation or not
      c = f(x1) * f(x0);

      // update the value of interval
      x1 = x2;
      x2 = x0;

      // if x0 is the root of equation then break the loop
      if (c == 0) break;
      xm = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));
    } while (Math.abs(xm - x0) >= E); // repeat the loop
    // until the convergence

    return x0;
  } else {
    return null;
  }
};

export const calculateScoreProbFromPoisson = (
  homeTeamGoals: number,
  awayTeamGoals: number,
  homeTeamLambda: number,
  awayTeamLambda: number
) => {
  return (
    poisson(homeTeamLambda, homeTeamGoals, false) *
    poisson(awayTeamLambda, awayTeamGoals, false)
  );
};

export const calculate3wayProbFromPoisson = (
  homeTeamLambda: number,
  awayTeamLambda: number
) => {
  let home = 0;
  let away = 0;
  let draw = 0;

  for (let hGoals = 0; hGoals < 10; hGoals++) {
    for (let aGoals = 0; aGoals < 10; aGoals++) {
      const diff = hGoals - aGoals;
      const prob = calculateScoreProbFromPoisson(
        hGoals,
        aGoals,
        homeTeamLambda,
        awayTeamLambda
      );
      switch (true) {
        case diff > 0:
          home += prob;
          break;
        case diff == 0:
          draw += prob;
          break;
        case diff < 0:
          away += prob;
          break;
        default:
          break;
      }
    }
  }
  return {
    home: home,
    away: away,
    draw: draw,
  };
};

export const calculateTeamLambdas = (
  totalGoals: number,
  matchprobs: { home: number; draw: number; away: number }
) => {
  const estimator = (home: boolean) => {
    const E = 0.01;
    let x1 = 0;
    let x2 = totalGoals;
    const f = (hGoals: number) => {
      const calculatedProbs = calculate3wayProbFromPoisson(
        hGoals,
        totalGoals - hGoals
      );
      const difference = home
        ? calculatedProbs.home - matchprobs.home
        : calculatedProbs.away - matchprobs.away;
      return difference;
    };
    let xm;
    let x0;
    let c;
    if (f(x1) * f(x2) < 0) {
      do {
        x0 = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));
        c = f(x1) * f(x0);
        x1 = x2;
        x2 = x0;
        if (c == 0) break;
        xm = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));
      } while (Math.abs(xm - x0) >= E);

      return x0;
    } else {
      return null;
    }
  };
  const homeEstimate = estimator(true);
  const awayEstimate = estimator(false);
  const average = [homeEstimate, awayEstimate].filter(
    (e): e is number => e != null
  );
  const homeGoals =
    average.reduce((prev, curr) => prev + curr, 0) / average.length;
  return { home: homeGoals, away: totalGoals - homeGoals };
};
