export * from './dhikr';
export * from './world';

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  ambientVolume: number; // 0 - 1
  sfxVolume: number; // 0 - 1
  theme: 'dark' | 'midnight' | 'deep-emerald';
}
