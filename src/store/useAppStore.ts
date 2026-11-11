import { create } from 'zustand';
import { WorldType, DhikrItem, DhikrSession, AppSettings } from '@/types';
import { audioService } from '@/services/audioService';

export const AUTHENTIC_ADHKAR: DhikrItem[] = [
  {
    id: 'istighfar-basic',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    meaning: 'Turning back to Allah with humility, purity of heart, and peaceful remembrance.',
    targetCount: 33,
    category: 'istighfar',
  },
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    meaning: 'Exalting the perfection of the Creator above any deficiency or imperfection.',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    meaning: 'Gratitude and sincere praise for continuous blessings and inner contentment.',
    targetCount: 33,
    category: 'hamd',
  },
  {
    id: 'allahu-akbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    meaning: 'Remembering that God is greater than every worldly concern or anxiety.',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Allahumma Salli Ala Muhammad',
    translation: 'O Allah, send blessings upon Muhammad',
    meaning: 'Peace, tranquility, and noble blessings upon the Beloved Prophet.',
    targetCount: 10,
    category: 'salawat',
  },
];

export const DEFAULT_DHIKR: DhikrItem = AUTHENTIC_ADHKAR[0];

interface AppStoreState {
  currentWorld: WorldType;
  currentDhikr: DhikrItem;
  adhkarList: DhikrItem[];
  session: DhikrSession;
  dailyTotal: number;
  settings: AppSettings;
  language: 'ar' | 'en';
  activeTab: 'counter' | 'adhkar' | 'worlds';
  setActiveTab: (tab: 'counter' | 'adhkar' | 'worlds') => void;
  setWorld: (world: WorldType) => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleLanguage: () => void;
  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikr: (dhikr: DhikrItem) => void;
  toggleSound: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  currentWorld: 'rain',
  currentDhikr: DEFAULT_DHIKR,
  adhkarList: AUTHENTIC_ADHKAR,
  dailyTotal: 0,
  activeTab: 'counter',
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
  language: 'ar',
  setActiveTab: (activeTab) => set({ activeTab }),
  setWorld: (currentWorld) => set({ currentWorld }),
  setLanguage: (language) => set({ language }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'ar' ? 'en' : 'ar' })),
  incrementDhikr: () => {
    const state = get();
    const newCount = state.session.count + 1;
    const target = state.currentDhikr.targetCount;
    const isCycleComplete = target > 0 && newCount >= target;

    // Trigger subtle audio & haptic feedback
    if (state.settings.soundEnabled) {
      if (isCycleComplete) {
        audioService.playSoundEffect('completion');
      } else {
        audioService.playSoundEffect('bead');
      }
    }
    if (state.settings.hapticEnabled) {
      audioService.triggerHaptic(isCycleComplete ? 'completion' : 'light');
    }

    set({
      dailyTotal: state.dailyTotal + 1,
      session: {
        ...state.session,
        count: isCycleComplete ? 0 : newCount,
        completedCycles: isCycleComplete
          ? state.session.completedCycles + 1
          : state.session.completedCycles,
        lastInteractionAt: Date.now(),
      },
    });
  },
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
      activeTab: 'counter',
      session: {
        dhikrId: currentDhikr.id,
        count: 0,
        completedCycles: 0,
        startedAt: Date.now(),
        lastInteractionAt: Date.now(),
      },
    })),
  toggleSound: () =>
    set((state) => {
      const soundEnabled = !state.settings.soundEnabled;
      audioService.setMuted(!soundEnabled);
      return {
        settings: {
          ...state.settings,
          soundEnabled,
        },
      };
    }),
  updateSettings: (partial) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    })),
}));
