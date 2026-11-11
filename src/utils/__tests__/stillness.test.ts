import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialStillnessState,
  updateStillnessTick,
  recordInteraction,
  STILLNESS_THRESHOLD_MS,
} from '../stillness';

describe('Stillness Moment pure logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in active state with 1.0 motion ease', () => {
    const state = createInitialStillnessState(1000);
    expect(state.isStill).toBe(false);
    expect(state.stillnessDurationMs).toBe(0);
    expect(state.motionEase).toBe(1.0);
  });

  it('remains active if idle time is below threshold (5s)', () => {
    const initial = createInitialStillnessState(1000);
    const result = updateStillnessTick(initial, 1000 + 3000, 200);

    expect(result.nextState.isStill).toBe(false);
    expect(result.justEnteredStillness).toBe(false);
    expect(result.newNoorPoints).toBe(0);
  });

  it('enters stillness after 5 continuous seconds of idle', () => {
    const initial = createInitialStillnessState(1000);
    const result = updateStillnessTick(initial, 1000 + STILLNESS_THRESHOLD_MS + 200, 200);

    expect(result.nextState.isStill).toBe(true);
    expect(result.justEnteredStillness).toBe(true);
    expect(result.nextState.motionEase).toBeLessThan(1.0);
  });

  it('awards +1 Noor Point for every 30 continuous seconds of stillness', () => {
    let state = createInitialStillnessState(1000);
    let now = 1000 + STILLNESS_THRESHOLD_MS;
    let accumulatedPoints = 0;

    // Simulate 35 seconds of continuous stillness tick by tick (200ms intervals)
    for (let i = 0; i < 175; i++) {
      now += 200;
      const res = updateStillnessTick(state, now, 200);
      state = res.nextState;
      accumulatedPoints += res.newNoorPoints;
    }

    expect(state.isStill).toBe(true);
    expect(accumulatedPoints).toBe(1);
    expect(state.totalStillnessSeconds).toBeGreaterThanOrEqual(30);

    // Another 30 seconds -> 2nd Noor Point
    for (let i = 0; i < 150; i++) {
      now += 200;
      const res = updateStillnessTick(state, now, 200);
      state = res.nextState;
      accumulatedPoints += res.newNoorPoints;
    }

    expect(accumulatedPoints).toBe(2);
  });

  it('exits stillness gently on interaction', () => {
    let state = createInitialStillnessState(1000);
    const entered = updateStillnessTick(state, 1000 + STILLNESS_THRESHOLD_MS + 1000, 200);
    expect(entered.nextState.isStill).toBe(true);

    const exited = recordInteraction(entered.nextState, 1000 + STILLNESS_THRESHOLD_MS + 2000);
    expect(exited.isStill).toBe(false);
    expect(exited.stillnessDurationMs).toBe(0);
    expect(exited.motionEase).toBe(0.95);
  });
});
