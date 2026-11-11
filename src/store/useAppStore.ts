import { create } from 'zustand';
import { WorldType, DhikrItem, DhikrSession, AppSettings } from '@/types';
import { audioService } from '@/services/audioService';

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

interface AppStoreState {
  currentWorld: WorldType;
  currentDhikr: DhikrItem;
  adhkarList: DhikrItem[];
  session: DhikrSession;
  dailyTotal: number;
  settings: AppSettings;
  language: 'ar' | 'en';
  activeTab: 'counter' | 'adhkar' | 'worlds';
  interactionIntensity: number; // dynamically pulses on interactions
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

export const useAppStore = create<AppStoreState>((set, get) => ({
  currentWorld: 'rain',
  currentDhikr: DEFAULT_DHIKR,
  adhkarList: AUTHENTIC_ADHKAR,
  dailyTotal: 0,
  activeTab: 'counter',
  interactionIntensity: 0,
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
  setWorld: (currentWorld) => {
    set({ currentWorld });
    audioService.setWorldAmbience(currentWorld);
  },
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
      interactionIntensity: 1.0,
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
  decayIntensity: () => {
    set((state) => ({
      interactionIntensity: Math.max(0, state.interactionIntensity * 0.92 - 0.01),
    }));
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
