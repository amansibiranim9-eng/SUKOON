/**
 * Stillness Moment: Pure logic for idle detection, stillness state transitions,
 * and Noor Points reward calculation.
 */

export interface StillnessTrackerState {
  lastInteractionTime: number;
  isStill: boolean;
  stillnessDurationMs: number;
  unclaimedStillnessMs: number;
  totalStillnessSeconds: number;
  motionEase: number; // 1.0 (normal) down to 0.2 (stillness)
}

export const STILLNESS_THRESHOLD_MS = 5000; // 5 seconds of idle to enter stillness
export const NOOR_POINT_INTERVAL_MS = 30000; // 30 continuous seconds = +1 Noor point

export function createInitialStillnessState(now: number = Date.now()): StillnessTrackerState {
  return {
    lastInteractionTime: now,
    isStill: false,
    stillnessDurationMs: 0,
    unclaimedStillnessMs: 0,
    totalStillnessSeconds: 0,
    motionEase: 1.0,
  };
}

export interface StillnessUpdateResult {
  nextState: StillnessTrackerState;
  newNoorPoints: number;
  justEnteredStillness: boolean;
  justExitedStillness: boolean;
}

/**
 * Updates stillness tracker on tick.
 */
export function updateStillnessTick(
  state: StillnessTrackerState,
  now: number,
  deltaMs: number
): StillnessUpdateResult {
  const idleTime = now - state.lastInteractionTime;
  const shouldBeStill = idleTime >= STILLNESS_THRESHOLD_MS;

  let isStill = state.isStill;
  let justEnteredStillness = false;
  let justExitedStillness = false;
  let stillnessDurationMs = state.stillnessDurationMs;
  let unclaimedStillnessMs = state.unclaimedStillnessMs;
  let newNoorPoints = 0;

  if (shouldBeStill) {
    if (!state.isStill) {
      isStill = true;
      justEnteredStillness = true;
      stillnessDurationMs = idleTime - STILLNESS_THRESHOLD_MS;
      unclaimedStillnessMs = stillnessDurationMs;
    } else {
      stillnessDurationMs += deltaMs;
      unclaimedStillnessMs += deltaMs;
    }

    // Award +1 Noor Point for every continuous 30 seconds
    if (unclaimedStillnessMs >= NOOR_POINT_INTERVAL_MS) {
      const awarded = Math.floor(unclaimedStillnessMs / NOOR_POINT_INTERVAL_MS);
      newNoorPoints += awarded;
      unclaimedStillnessMs = unclaimedStillnessMs % NOOR_POINT_INTERVAL_MS;
    }
  } else {
    if (state.isStill) {
      isStill = false;
      justExitedStillness = true;
    }
    stillnessDurationMs = 0;
    unclaimedStillnessMs = 0;
  }

  // Smooth motion easing: targets 0.2 when still, 1.0 when active
  const targetEase = isStill ? 0.2 : 1.0;
  const easeSpeed = isStill ? 0.05 : 0.12; // Enter gently, exit gently
  const motionEase = state.motionEase + (targetEase - state.motionEase) * easeSpeed;

  const totalStillnessSeconds = Math.floor(stillnessDurationMs / 1000);

  return {
    nextState: {
      lastInteractionTime: state.lastInteractionTime,
      isStill,
      stillnessDurationMs,
      unclaimedStillnessMs,
      totalStillnessSeconds,
      motionEase,
    },
    newNoorPoints,
    justEnteredStillness,
    justExitedStillness,
  };
}

/**
 * Records an interaction (tap or pointer move), exiting stillness gently.
 */
export function recordInteraction(
  _state: StillnessTrackerState,
  now: number = Date.now()
): StillnessTrackerState {
  return {
    lastInteractionTime: now,
    isStill: false,
    stillnessDurationMs: 0,
    unclaimedStillnessMs: 0,
    totalStillnessSeconds: 0,
    motionEase: 0.95, // starts smooth transition back to 1.0
  };
}
