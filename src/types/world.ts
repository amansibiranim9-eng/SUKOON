export type WorldType = 'rain' | 'noor' | 'sakina';

export interface WorldConfig {
  id: WorldType;
  name: string;
  arabicName: string;
  description: string;
  themeColor: string;
  accentColor: string;
  ambientSoundTrack?: string;
  particleCount: number;
  speed: number;
}

export interface WorldState {
  currentWorld: WorldType;
  intensity: number; // 0.0 - 1.0 (scales with Dhikr activity)
  isMuted: boolean;
  isPaused: boolean;
}
