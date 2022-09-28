const oddsToAdjProbs = (rawOdds: number[]) => {
  const margin = rawOdds.reduce((prev, current) => prev + 1 / current, 0) - 1;
  return rawOdds.map((odd) => 1 / odd / (1 + margin));
};

export default oddsToAdjProbs;
