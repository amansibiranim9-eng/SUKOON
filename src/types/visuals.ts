import { ProgressionTier } from '@/utils/progression';

export interface TapEventData {
  id: number;
  // Normalized Device Coordinates (-1 to 1)
  ndcX: number;
  ndcY: number;
  // Screen pixel coordinates
  screenX: number;
  screenY: number;
  intensity: number;
  tier: ProgressionTier;
  timestamp: number;
}

export interface ClimaxEventData {
  timestamp: number;
  intensity: number;
}

export interface PersistentStar {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  twinklePhase: number;
}
