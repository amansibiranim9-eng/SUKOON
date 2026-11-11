import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorldType, DhikrItem, DhikrSession, AppSettings } from '@/types';
import { audioService } from '@/services/audioService';
import {
  calculateTier,
  calculateIntensity,
  decayIntensity,
  ProgressionTier,
} from '@/utils/progression';

export const AUTHENTIC_ADHKAR: DhikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    meaning: 'Exalting the absolute perfection of Allah above all deficiency and limitation.',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    meaning: 'Eternal gratitude and supreme praise for visible and hidden bounties.',
    targetCount: 33,
    category: 'hamd',
  },
  {
    id: 'allahu-akbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    meaning: 'Remembering that God is greater than every worldly thought, fear, and circumstance.',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    meaning: 'Turning back to the Merciful with sincerity, peace, and spiritual renewal.',
    targetCount: 33,
    category: 'istighfar',
  },
  {
    id: 'la-ilaha-illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    transliteration: 'La ilaha illa Allah',
    translation: 'There is no god but Allah',
    meaning: 'The eternal declaration of Divine Unity and spiritual liberation.',
    targetCount: 100,
    category: 'tasbih',
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma Salli wa Sallim 'ala Nabiyyina Muhammad",
    translation: 'O Allah, send peace and blessings upon our Prophet Muhammad',
    meaning: 'Invoking divine light, tranquility, and prayers upon the Messenger of Mercy.',
    targetCount: 10,
    category: 'salawat',
  },
  {
    id: 'adhkar-sabah',
    arabic: 'أَذْكَارُ الصَّبَاحِ',
    transliteration: 'Adhkar As-Sabah',
    translation: 'Morning Remembrances',
    meaning: 'Divine protection, luminous peace, and barakah to welcome the dawn.',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'adhkar-masa',
    arabic: 'أَذْكَارُ الْمَسَاءِ',
    transliteration: 'Adhkar Al-Masa',
    translation: 'Evening Remembrances',
    meaning: 'Tranquil sanctuary, gratitude, and spiritual serenity as the night settles.',
    targetCount: 33,
    category: 'tasbih',
  },
];

export const DEFAULT_DHIKR: DhikrItem = AUTHENTIC_ADHKAR[0];

export type AppView = 'home' | 'session';

export interface AppStoreState {
  view: AppView;
  currentWorld: WorldType;
  currentDhikr: DhikrItem;
  adhkarList: DhikrItem[];
  session: DhikrSession;
  dailyTotal: number;
  dailyHistory: Record<string, number>;
  settings: AppSettings;
  language: 'ar' | 'en';
  activeTab: 'counter' | 'adhkar' | 'worlds';
  rawIntensity: number;
  intensity: number;
  interactionIntensity: number; // alias for backwards compatibility
  tier: ProgressionTier;

  setView: (view: AppView) => void;
  setActiveTab: (tab: 'counter' | 'adhkar' | 'worlds') => void;
  setWorld: (world: WorldType) => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleLanguage: () => void;
  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikr: (dhikr: DhikrItem) => void;
  toggleSound: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  decayIntensity: () => void;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      view: 'home',
      currentWorld: 'rain',
      currentDhikr: DEFAULT_DHIKR,
      adhkarList: AUTHENTIC_ADHKAR,
      dailyTotal: 0,
      dailyHistory: {},
      activeTab: 'counter',
      rawIntensity: 0,
      intensity: 0,
      interactionIntensity: 0,
      tier: 0,
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

      setView: (view: AppView) => set({ view }),

      setActiveTab: (activeTab) => set({ activeTab }),

      setWorld: (currentWorld) => {
        set({ currentWorld });
        audioService.setWorldAmbience(currentWorld);
      },

      setLanguage: (language) => set({ language }),

      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'ar' ? 'en' : 'ar' })),

      incrementDhikr: () => {
        const state = get();
        const currentCount = state.session.count;
        const target = state.currentDhikr.targetCount;
        const nextCount = currentCount + 1;
        const isCycleComplete = target > 0 && nextCount >= target;

        // Audio & Haptic feedback
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

        const newCount = isCycleComplete ? 0 : nextCount;
        const newCycles = isCycleComplete
          ? state.session.completedCycles + 1
          : state.session.completedCycles;

        const nextRawIntensity = 1.0;
        const easedIntensity = calculateIntensity(nextRawIntensity);
        const nextTier = calculateTier(newCount, target);

        const todayKey = getTodayKey();
        const updatedTodayCount = (state.dailyHistory[todayKey] || 0) + 1;

        set({
          dailyTotal: state.dailyTotal + 1,
          dailyHistory: {
            ...state.dailyHistory,
            [todayKey]: updatedTodayCount,
          },
          rawIntensity: nextRawIntensity,
          intensity: easedIntensity,
          interactionIntensity: easedIntensity,
          tier: nextTier,
          session: {
            ...state.session,
            count: newCount,
            completedCycles: newCycles,
            lastInteractionAt: Date.now(),
          },
        });
      },

      decayIntensity: () => {
        set((state) => {
          if (state.rawIntensity <= 0) return state;
          const nextRaw = decayIntensity(state.rawIntensity);
          const nextEased = calculateIntensity(nextRaw);
          return {
            rawIntensity: nextRaw,
            intensity: nextEased,
            interactionIntensity: nextEased,
          };
        });
      },

      resetDhikr: () => {
        const state = get();
        const target = state.currentDhikr.targetCount;
        set({
          tier: calculateTier(0, target),
          session: {
            ...state.session,
            count: 0,
            completedCycles: 0,
            lastInteractionAt: Date.now(),
          },
        });
      },

      setDhikr: (currentDhikr) =>
        set(() => ({
          currentDhikr,
          activeTab: 'counter',
          tier: calculateTier(0, currentDhikr.targetCount),
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
    }),
    {
      name: 'sukoon_app_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        language: state.language,
        currentWorld: state.currentWorld,
        dailyTotal: state.dailyTotal,
        dailyHistory: state.dailyHistory,
        session: {
          dhikrId: state.session.dhikrId,
          count: state.session.count,
          completedCycles: state.session.completedCycles,
          startedAt: state.session.startedAt,
          lastInteractionAt: state.session.lastInteractionAt,
        },
      }),
    }
  )
);
