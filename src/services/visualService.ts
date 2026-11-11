/**
 * Pure Visual Service & Event Bus for High Performance Three.js Render Loops.
 * Decouples 60fps/120fps visual animation updates from React component state re-renders.
 */

import { ProgressionTier } from '@/utils/progression';
import { TapEventData, ClimaxEventData } from '@/types/visuals';

type TapListener = (tap: TapEventData) => void;
type ClimaxListener = (climax: ClimaxEventData) => void;
type FlowListener = (flow: number) => void;

export class VisualService {
  private tapListeners: Set<TapListener> = new Set();
  private climaxListeners: Set<ClimaxListener> = new Set();
  private flowListeners: Set<FlowListener> = new Set();

  // Pointer / Gyroscope Parallax state (-1 to 1)
  public parallaxX: number = 0;
  public parallaxY: number = 0;
  public targetParallaxX: number = 0;
  public targetParallaxY: number = 0;

  // Flow mechanic tracking
  private lastTapTimestamp: number = 0;
  private tapIntervals: number[] = [];
  public currentFlow: number = 0.0; // 0.0 to 1.0

  constructor() {
    this.initParallaxListeners();
  }

  private initParallaxListeners(): void {
    if (typeof window === 'undefined') return;

    // Mouse / Pointer Parallax
    window.addEventListener(
      'pointermove',
      (e: PointerEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.targetParallaxX = x * 0.5;
        this.targetParallaxY = y * 0.5;
      },
      { passive: true }
    );

    // DeviceOrientation / Gyroscope Parallax for mobile
    window.addEventListener(
      'deviceorientation',
      (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          // gamma: left to right [-90, 90]
          // beta: front to back [-180, 180]
          const x = Math.max(-1, Math.min(1, e.gamma / 35));
          const y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
          this.targetParallaxX = x * 0.6;
          this.targetParallaxY = y * 0.6;
        }
      },
      { passive: true }
    );
  }

  /**
   * Updates parallax smooth lerp inside Three.js animation loops
   */
  public updateParallax(lerpFactor: number = 0.05): void {
    this.parallaxX += (this.targetParallaxX - this.parallaxX) * lerpFactor;
    this.parallaxY += (this.targetParallaxY - this.parallaxY) * lerpFactor;
  }

  /**
   * Register tap listener for Three.js scene
   */
  public onTap(listener: TapListener): () => void {
    this.tapListeners.add(listener);
    return () => {
      this.tapListeners.delete(listener);
    };
  }

  /**
   * Register climax event listener
   */
  public onClimax(listener: ClimaxListener): () => void {
    this.climaxListeners.add(listener);
    return () => {
      this.climaxListeners.delete(listener);
    };
  }

  /**
   * Register flow change listener
   */
  public onFlow(listener: FlowListener): () => void {
    this.flowListeners.add(listener);
    return () => {
      this.flowListeners.delete(listener);
    };
  }

  /**
   * Calculate flow metric from steady tapping rhythm:
   * Dhikr cadence is typically between 700ms - 2200ms per tap.
   * If consecutive intervals have low variance, flow quickly increases to 1.0.
   */
  public updateFlow(now: number = Date.now()): number {
    if (this.lastTapTimestamp === 0) {
      this.lastTapTimestamp = now;
      this.currentFlow = 0.15;
      this.notifyFlow();
      return this.currentFlow;
    }

    const interval = now - this.lastTapTimestamp;
    this.lastTapTimestamp = now;

    // Ideal Dhikr rhythm window: 600ms - 2500ms
    if (interval >= 500 && interval <= 2800) {
      this.tapIntervals.push(interval);
      if (this.tapIntervals.length > 5) {
        this.tapIntervals.shift();
      }

      // Check cadence regularity
      if (this.tapIntervals.length >= 2) {
        const mean =
          this.tapIntervals.reduce((a, b) => a + b, 0) / this.tapIntervals.length;
        const variance =
          this.tapIntervals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
          this.tapIntervals.length;
        const stdDev = Math.sqrt(variance);

        // Regular tapping rhythm has standard deviation < 400ms
        const rhythmScore = Math.max(0, 1 - stdDev / 450);
        this.currentFlow = Math.min(1.0, this.currentFlow + 0.18 * rhythmScore + 0.05);
      } else {
        this.currentFlow = Math.min(1.0, this.currentFlow + 0.15);
      }
    } else {
      // Tap cadence broken or too fast/slow
      this.tapIntervals = [];
      this.currentFlow = Math.max(0.1, this.currentFlow * 0.65);
    }

    this.notifyFlow();
    return this.currentFlow;
  }

  /**
   * Decay flow when user pauses
   */
  public decayFlow(): void {
    if (this.currentFlow > 0) {
      this.currentFlow = Math.max(0, this.currentFlow - 0.015);
      this.notifyFlow();
    }
  }

  private notifyFlow(): void {
    this.flowListeners.forEach((fn) => {
      try {
        fn(this.currentFlow);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Broadcast tap coordinate to active Three.js loops and trigger haptic
   */
  public triggerTap(
    screenX: number,
    screenY: number,
    intensity: number = 1.0,
    tier: ProgressionTier = 0,
    hapticEnabled: boolean = true
  ): void {
    const width = typeof window !== 'undefined' ? window.innerWidth : 800;
    const height = typeof window !== 'undefined' ? window.innerHeight : 600;

    const ndcX = (screenX / width) * 2 - 1;
    const ndcY = -(screenY / height) * 2 + 1;

    const tapData: TapEventData = {
      id: Date.now() + Math.random(),
      ndcX,
      ndcY,
      screenX,
      screenY,
      intensity,
      tier,
      timestamp: Date.now(),
    };

    // Update flow
    this.updateFlow(tapData.timestamp);

    // Haptics per tier
    if (hapticEnabled) {
      this.triggerTierHaptic(tier);
    }

    // Direct notification to Three.js refs without React re-render
    this.tapListeners.forEach((listener) => {
      try {
        listener(tapData);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Broadcast climax cycle completion
   */
  public triggerClimax(hapticEnabled: boolean = true): void {
    const climaxData: ClimaxEventData = {
      timestamp: Date.now(),
      intensity: 1.0,
    };

    if (hapticEnabled) {
      this.triggerClimaxHaptic();
    }

    this.climaxListeners.forEach((listener) => {
      try {
        listener(climaxData);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Distinct haptic patterns per progression tier
   * Tier 0: gentle 12ms tap
   * Tier 1: medium 24ms tap
   * Tier 2: firm 35ms tap
   */
  public triggerTierHaptic(tier: ProgressionTier): void {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    try {
      if (tier === 0) {
        navigator.vibrate(12);
      } else if (tier === 1) {
        navigator.vibrate(24);
      } else {
        navigator.vibrate(36);
      }
    } catch {
      // unsupported
    }
  }

  /**
   * Rhythmic sacred burst haptic on cycle climax
   */
  public triggerClimaxHaptic(): void {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate([45, 60, 55, 60, 75]);
    } catch {
      // unsupported
    }
  }
}

export const visualService = new VisualService();
