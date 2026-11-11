import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';

describe('useAppStore progression and view logic', () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      view: 'home',
      dailyTotal: 0,
      dailyHistory: {},
      rawIntensity: 0,
      intensity: 0,
      tier: 0,
      session: {
        dhikrId: 'subhanallah',
        count: 0,
        completedCycles: 0,
        startedAt: Date.now(),
        lastInteractionAt: Date.now(),
      },
    });
  });

  it('switches view between home and session', () => {
    expect(useAppStore.getState().view).toBe('home');
    useAppStore.getState().setView('session');
    expect(useAppStore.getState().view).toBe('session');
    useAppStore.getState().setView('home');
    expect(useAppStore.getState().view).toBe('home');
  });

  it('increments count, updates dailyTotal, dailyHistory, intensity and tier', () => {
    const store = useAppStore.getState();
    store.incrementDhikr();

    const state1 = useAppStore.getState();
    expect(state1.session.count).toBe(1);
    expect(state1.dailyTotal).toBe(1);
    expect(state1.intensity).toBeGreaterThan(0);
    expect(state1.tier).toBe(0);

    const today = new Date().toISOString().slice(0, 10);
    expect(state1.dailyHistory[today]).toBe(1);
  });

  it('calculates tier transitions correctly on 33 target dhikr', () => {
    // 0 to 10: tier 0 (< 33%)
    // 11 to 21: tier 1 (>= 33% and < 66%)
    // 22 to 32: tier 2 (>= 66%)
    for (let i = 0; i < 11; i++) {
      useAppStore.getState().incrementDhikr();
    }
    expect(useAppStore.getState().session.count).toBe(11);
    expect(useAppStore.getState().tier).toBe(1);

    for (let i = 0; i < 11; i++) {
      useAppStore.getState().incrementDhikr();
    }
    expect(useAppStore.getState().session.count).toBe(22);
    expect(useAppStore.getState().tier).toBe(2);
  });

  it('completes cycle when reaching targetCount and resets count to 0 while incrementing completedCycles', () => {
    // Target is 33
    for (let i = 0; i < 33; i++) {
      useAppStore.getState().incrementDhikr();
    }

    const state = useAppStore.getState();
    expect(state.session.completedCycles).toBe(1);
    expect(state.session.count).toBe(0);
    expect(state.dailyTotal).toBe(33);
  });
});
