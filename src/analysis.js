export function analyzeWorkout(workout) {
  const durationMin =
    (workout.endTime - workout.startTime) / 60000;

  let totalVolume = 0;
  let totalSets = 0;
  let totalRPE = 0;
  let hardSets = 0;

  workout.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      const volume = set.weight * set.reps;
      totalVolume += volume;
      totalSets++;
      totalRPE += set.rpe;
      if (set.rpe >= 8) hardSets++;
    });
  });

  const avgRPE = totalSets ? totalRPE / totalSets : 0;
  const density = durationMin ? totalVolume / durationMin : 0;
  const hardRatio = totalSets ? (hardSets / totalSets) * 100 : 0;

  return {
    durationMin: durationMin.toFixed(1),
    totalVolume,
    avgRPE: avgRPE.toFixed(2),
    density: density.toFixed(1),
    hardRatio: hardRatio.toFixed(1)
  };
}
