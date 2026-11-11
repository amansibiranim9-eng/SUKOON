export * from './dhikr';
export * from './world';
export * from './visuals';

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  ambientVolume: number;
  sfxVolume: number;
  theme: 'dark' | 'light';
}
