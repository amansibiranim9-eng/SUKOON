/**
 * Pure progression calculation logic for SUKOON
 */

export type ProgressionTier = 0 | 1 | 2;

/**
 * Calculates the current tier based on progress percentage towards targetCount:
 * - Tier 0: 0% to < 33%
 * - Tier 1: 33% to < 66%
 * - Tier 2: 66% to 99% (and 100%)
 *
 * @param count - Current count
 * @param targetCount - Target count for the cycle
 * @returns 0 | 1 | 2
 */
export function calculateTier(count: number, targetCount: number): ProgressionTier {
  if (targetCount <= 0 || count <= 0) {
    return 0;
  }

  const ratio = count / targetCount;

  if (ratio < 0.33) {
    return 0;
  }
  if (ratio < 0.66) {
    return 1;
  }
  return 2;
}

/**
 * Standard cubic ease-out function: 1 - (1 - t)^3
 * Maps [0, 1] -> [0, 1] smoothly
 */
export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Calculates eased intensity given raw intensity.
 * @param rawIntensity - Value between 0 and 1
 * @returns Eased intensity between 0 and 1
 */
export function calculateIntensity(rawIntensity: number): number {
  const clamped = Math.max(0, Math.min(1, rawIntensity));
  return easeOutCubic(clamped);
}

/**
 * Decays an intensity value over time.
 * @param currentIntensity - The current intensity (0 to 1)
 * @param decayFactor - Factor per tick / decay step (default: 0.92)
 * @param stepDecrement - Additional linear decrement (default: 0.01)
 * @returns Decayed intensity clamped between 0 and 1
 */
export function decayIntensity(
  currentIntensity: number,
  decayFactor = 0.92,
  stepDecrement = 0.01
): number {
  if (currentIntensity <= 0) return 0;
  const decayed = currentIntensity * decayFactor - stepDecrement;
  return Math.max(0, Math.min(1, decayed));
}
