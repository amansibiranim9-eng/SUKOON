export type DhikrCategory =
  | 'istighfar'
  | 'tasbih'
  | 'hamd'
  | 'salawat'
  | 'morning'
  | 'evening';

export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string | { ar: string; en: string };
  meaning?: string;
  targetCount: number;
  category: DhikrCategory;
  source?: string;
}

export interface DhikrSession {
  dhikrId: string;
  count: number;
  completedCycles: number;
  startedAt: number;
  lastInteractionAt: number;
}
