export * from './dhikr';
export * from './world';
export * from './visuals';

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  ambientVolume: number;
  sfxVolume: number;
  theme: 'dark' | 'light';
  // Signature Features Toggles
  stillnessEnabled: boolean;
  voiceModeEnabled: boolean;
  voiceCountEnabled: boolean;
  voiceSensitivity: number; // 0.0 to 1.0 (default 0.5)
  reducedMotion: boolean;
}
