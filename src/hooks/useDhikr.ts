import { useCallback } from 'react';
import { useAppStore } from '@/store';

export function useDhikr() {
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const session = useAppStore((state) => state.session);
  const increment = useAppStore((state) => state.incrementDhikr);
  const reset = useAppStore((state) => state.resetDhikr);

  const tap = useCallback(() => {
    increment();
  }, [increment]);

  const progress =
    currentDhikr.targetCount > 0
      ? (session.count / currentDhikr.targetCount) * 100
      : 0;

  return {
    dhikr: currentDhikr,
    count: session.count,
    targetCount: currentDhikr.targetCount,
    completedCycles: session.completedCycles,
    progress,
    tap,
    reset,
  };
}
