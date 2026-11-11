import { describe, it, expect } from 'vitest';
import {
  calculateTier,
  calculateIntensity,
  decayIntensity,
} from '../progression';

describe('calculateTier', () => {
  it('returns tier 0 for 0 count or non-positive target count', () => {
    expect(calculateTier(0, 33)).toBe(0);
    expect(calculateTier(0, 0)).toBe(0);
    expect(calculateTier(5, -1)).toBe(0);
  });

  it('returns tier 0 for 0% - 32.9% of target count', () => {
    // 10 / 33 = 0.303 => Tier 0
    expect(calculateTier(10, 33)).toBe(0);
    // 32 / 100 = 0.32 => Tier 0
    expect(calculateTier(32, 100)).toBe(0);
  });

  it('returns tier 1 for 33% - 65.9% of target count', () => {
    // 33 / 100 = 0.33 => Tier 1
    expect(calculateTier(33, 100)).toBe(1);
    // 11 / 33 = 0.333 => Tier 1
    expect(calculateTier(11, 33)).toBe(1);
    // 21 / 33 = 0.636 => Tier 1
    expect(calculateTier(21, 33)).toBe(1);
    // 65 / 100 = 0.65 => Tier 1
    expect(calculateTier(65, 100)).toBe(1);
  });

  it('returns tier 2 for 66% - 99% (and 100%)', () => {
    // 22 / 33 = 0.666 => Tier 2
    expect(calculateTier(22, 33)).toBe(2);
    // 66 / 100 = 0.66 => Tier 2
    expect(calculateTier(66, 100)).toBe(2);
    // 99 / 100 = 0.99 => Tier 2
    expect(calculateTier(99, 100)).toBe(2);
    // 33 / 33 = 1.0 => Tier 2
    expect(calculateTier(33, 33)).toBe(2);
  });
});

describe('calculateIntensity and decayIntensity', () => {
  it('eases intensity with cubic ease-out curve', () => {
    expect(calculateIntensity(0)).toBe(0);
    expect(calculateIntensity(1)).toBe(1);
    // Check that easing accelerates early (cubic ease out gives > 0.5 for input 0.5)
    expect(calculateIntensity(0.5)).toBeCloseTo(0.875, 3);
  });

  it('decays intensity over time towards 0', () => {
    let intensity = 1.0;
    intensity = decayIntensity(intensity);
    expect(intensity).toBeLessThan(1.0);
    expect(intensity).toBeGreaterThan(0.5);

    // After multiple decays it reaches 0
    for (let i = 0; i < 40; i++) {
      intensity = decayIntensity(intensity);
    }
    expect(intensity).toBe(0);
  });

  it('clamps raw values between 0 and 1', () => {
    expect(calculateIntensity(-0.5)).toBe(0);
    expect(calculateIntensity(1.5)).toBe(1);
    expect(decayIntensity(-1)).toBe(0);
  });
});
