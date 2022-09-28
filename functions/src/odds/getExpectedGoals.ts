import oddsToAdjProbs from "./oddsToAdjProbs";
import { findLambda } from "./poisson";

const getExpectedGoals = (
  overUnderOdds: { threshold: number; over: number; under: number }[]
) => {
  //   const data: Array<{
  //     threshold: number;
  //     over: number | undefined;
  //     under: number | undefined;
  //   }> = [];
  // adjust data format to data array
  //   for (let index = 0; index < overUnderOdds.length; index++) {
  //     const threshold = Number(overUnderOdds[index].value.split(" ")[1]);
  //     if (threshold > 1 && threshold < 5) {
  //       const elementIndex = data.findIndex((d) => d.threshold === threshold);
  //       if (elementIndex === -1) {
  //         data.push({
  //           threshold: threshold,
  //           over: overUnderOdds.find((o) => o.value === `Over ${threshold}`)
  //             ?.odd,
  //           under: overUnderOdds.find((o) => o.value === `Under ${threshold}`)
  //             ?.odd,
  //         });
  //       }
  //     }
  //   }

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
