import oddsToAdjProbs from "./oddsToAdjProbs";
import { findLambda } from "./poisson";

const getExpectedGoals = (
  overUnderOdds: { threshold: number; over: number; under: number }[]
) => {
  const dataPoints = overUnderOdds
    .map((datapoint) => {
      if (
        typeof datapoint.over != "undefined" &&
        typeof datapoint.under != "undefined"
      ) {
        const [probUnder] = oddsToAdjProbs([datapoint.under, datapoint.over]);
        const expectedGoals = findLambda(
          1,
          6,
          Math.floor(datapoint.threshold),
          probUnder
        );
        return expectedGoals;
      } else return null;
    })
    .filter((e): e is number => e != null);

  const average =
    dataPoints.reduce((prev, curr) => prev + curr, 0) / dataPoints.length;
  return average;
};

export default getExpectedGoals;
