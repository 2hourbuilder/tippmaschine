interface PointsDistributionData {
  points: number;
  prob: number;
}

export const combinePointDistributions = (
  newData: Array<PointsDistributionData>,
  existingDistribution?: Array<PointsDistributionData>
) => {
  if (typeof existingDistribution === "undefined") {
    return newData;
  }
  const combinedDist: Array<PointsDistributionData> = [];
  existingDistribution.forEach((e) => {
    newData.forEach((n) => {
      const newPoints = e.points + n.points;
      const newProb = e.prob * n.prob;
      const exists = combinedDist.findIndex((c) => c.points === newPoints);
      if (exists >= 0) {
        combinedDist[exists].prob += newProb;
      } else {
        combinedDist.push({
          points: newPoints,
          prob: newProb,
        });
      }
    });

    return combinedDist;
  });
};
