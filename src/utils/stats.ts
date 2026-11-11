/**
 * Pure functions for user Dhikr progress, streaks, and analytics.
 */

export interface DhikrStats {
  todayCount: number;
  totalCount: number;
  completedCycles: number;
  streakDays: number;
}

/**
 * Formats a Date object into 'YYYY-MM-DD' key for consistent history mapping.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates current consecutive day streak from dailyHistory.
 * A streak continues if either:
 * - User completed dhikr today, and yesterday, the day before, etc.
 * - User completed dhikr yesterday and hasn't yet completed today (streak is preserved from yesterday).
 */
export function calculateStreak(
  dailyHistory: Record<string, number>,
  currentDate: Date = new Date()
): number {
  if (!dailyHistory || Object.keys(dailyHistory).length === 0) {
    return 0;
  }

  const checkDate = new Date(currentDate);
  checkDate.setHours(0, 0, 0, 0);

  const todayKey = formatDateKey(checkDate);
  const todayCount = dailyHistory[todayKey] || 0;

  // If user has count today, start checking from today backwards.
  // If not, check from yesterday backwards (preserving streak).
  if (todayCount === 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const key = formatDateKey(checkDate);
    const count = dailyHistory[key] || 0;

    if (count > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Returns today's total count from dailyHistory.
 */
export function getTodayCount(
  dailyHistory: Record<string, number>,
  currentDate: Date = new Date()
): number {
  if (!dailyHistory) return 0;
  const todayKey = formatDateKey(currentDate);
  return dailyHistory[todayKey] || 0;
}

/**
 * Computes complete Dhikr stats package.
 */
export function calculateStats(
  dailyHistory: Record<string, number>,
  totalCount: number,
  completedCycles: number,
  currentDate: Date = new Date()
): DhikrStats {
  return {
    todayCount: getTodayCount(dailyHistory, currentDate),
    totalCount: Math.max(0, totalCount),
    completedCycles: Math.max(0, completedCycles),
    streakDays: calculateStreak(dailyHistory, currentDate),
  };
}
