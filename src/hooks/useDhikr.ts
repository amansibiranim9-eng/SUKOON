import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { calculateTier, calculateIntensity } from '@/utils/progression';

export function useDhikr() {
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const session = useAppStore((state) => state.session);
  const intensity = useAppStore((state) => state.intensity);
  const rawIntensity = useAppStore((state) => state.rawIntensity);
  const tier = useAppStore((state) => state.tier);
  const increment = useAppStore((state) => state.incrementDhikr);
  const reset = useAppStore((state) => state.resetDhikr);

  const tap = useCallback(() => {
    increment();
  }, [increment]);

  const targetCount = currentDhikr.targetCount;
  const progress =
    targetCount > 0 ? (session.count / targetCount) * 100 : 0;

  // Derived tier & intensity fallbacks if store state hasn't computed yet
  const derivedTier = tier ?? calculateTier(session.count, targetCount);
  const derivedIntensity = intensity ?? calculateIntensity(rawIntensity);

  return {
    dhikr: currentDhikr,
    count: session.count,
    targetCount,
    completedCycles: session.completedCycles,
    progress,
    tier: derivedTier,
    intensity: derivedIntensity,
    tap,
    reset,
  };
}
