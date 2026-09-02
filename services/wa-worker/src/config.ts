export const CONFIG = {
  // Throttling configuration per spec §6.4 (under 2 msg/sec with randomized human jitter)
  minDelayMs: 600,
  maxDelayMs: 1100,
  maxAttempts: 3,
  pollIntervalMs: 2500,
  hourlyVolumeCap: 150,
  dailyVolumeCap: 1000,
};
