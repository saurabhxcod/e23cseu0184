const knapsack = (tasks, maxHours) => {
  const n = tasks.length;
  const dp = Array.from({ length: n + 1 },
    () => new Array(maxHours + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];
    for (let w = 0; w <= maxHours; w++) {
      dp[i][w] = dp[i - 1][w];
      if (Duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
      }
    }
  }
  const selected = [];
  let w = maxHours;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }

  return {
    selectedTasks: selected,
    totalImpact: dp[n][maxHours],
    totalHoursUsed: selected.reduce((sum, t) => sum + t.Duration, 0)
  };
};

export default knapsack;