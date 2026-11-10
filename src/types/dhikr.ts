export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  targetCount: number;
  category?: 'istighfar' | 'tasbih' | 'hamd' | 'salawat';
}

export interface DhikrSession {
  dhikrId: string;
  count: number;
  completedCycles: number;
  startedAt: number;
  lastInteractionAt: number;
}
