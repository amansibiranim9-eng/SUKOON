import { create } from 'zustand';
import { WorldType, DhikrItem, DhikrSession, AppSettings } from '@/types';

export const DEFAULT_DHIKR: DhikrItem = {
  id: 'istighfar-basic',
  arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
  transliteration: 'Astaghfirullah',
  translation: 'I seek forgiveness from Allah',
  meaning: 'Turning back to Allah with humility, purity of heart, and peaceful remembrance.',
  targetCount: 33,
  category: 'istighfar',
};

interface AppStoreState {
  currentWorld: WorldType;
  currentDhikr: DhikrItem;
  session: DhikrSession;
  settings: AppSettings;
  setWorld: (world: WorldType) => void;
  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikr: (dhikr: DhikrItem) => void;
  toggleSound: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  currentWorld: 'rain',
  currentDhikr: DEFAULT_DHIKR,
  session: {
    dhikrId: DEFAULT_DHIKR.id,
    count: 0,
    completedCycles: 0,
    startedAt: Date.now(),
    lastInteractionAt: Date.now(),
  },
  settings: {
    soundEnabled: true,
    hapticEnabled: true,
    ambientVolume: 0.6,
    sfxVolume: 0.8,
    theme: 'dark',
  },
  setWorld: (currentWorld) => set({ currentWorld }),
  incrementDhikr: () =>
    set((state) => {
      const newCount = state.session.count + 1;
      const target = state.currentDhikr.targetCount;
      const isCycleComplete = target > 0 && newCount >= target;

      return {
        session: {
          ...state.session,
          count: isCycleComplete ? 0 : newCount,
          completedCycles: isCycleComplete
            ? state.session.completedCycles + 1
            : state.session.completedCycles,
          lastInteractionAt: Date.now(),
        },
      };
    }),
  resetDhikr: () =>
    set((state) => ({
      session: {
        ...state.session,
        count: 0,
        completedCycles: 0,
        lastInteractionAt: Date.now(),
      },
    })),
  setDhikr: (currentDhikr) =>
    set(() => ({
      currentDhikr,
      session: {
        dhikrId: currentDhikr.id,
        count: 0,
        completedCycles: 0,
        startedAt: Date.now(),
        lastInteractionAt: Date.now(),
      },
    })),
  toggleSound: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        soundEnabled: !state.settings.soundEnabled,
      },
    })),
  updateSettings: (partial) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    })),
}));
