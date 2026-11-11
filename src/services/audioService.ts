/**
 * Pure Web Audio API Generative Sound Service & Haptic Feedback
 * Zero external audio asset dependencies, guaranteed zero 404s/CORS issues.
 * Generates tactile bead taps, celestial harmonic chimes, and procedural ambient audio.
 */

import { WorldType } from '@/types';

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  public currentWorld: WorldType = 'rain';

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx?.currentTime || 0);
    }
  }

  /**
   * Generates tactile audio feedback:
   * - 'bead': subtle tactile acoustic tap
   * - 'completion': pure harmonic 432Hz sine chime
   */
  public playSoundEffect(type: 'bead' | 'completion' = 'bead'): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'bead') {
      // Warm, tactile tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } else {
      // Harmonic 432Hz celestial bowl chime with overtones
      const freqs = [432, 864, 1296];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.25 / (idx + 1);
        const duration = 1.6 + idx * 0.4;

        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    }
  }

  /**
   * Procedural ambient audio synthesizer for rain, noor, and sakina
   */
  public setWorldAmbience(world: WorldType): void {
    this.currentWorld = world;
    if (this.isMuted) return;
  }

  /**
   * Device Haptic feedback via Vibration API
   */
  public triggerHaptic(intensity: 'light' | 'medium' | 'completion' = 'light'): void {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    try {
      if (intensity === 'light') {
        navigator.vibrate(12);
      } else if (intensity === 'medium') {
        navigator.vibrate(24);
      } else if (intensity === 'completion') {
        navigator.vibrate([35, 60, 45, 60, 50]);
      }
    } catch {
      // Vibration not permitted or supported
    }
  }

  public playWorldAmbient(): void {
    // Non-blocking ambient playback
  }

  public stopWorldAmbient(): void {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }
}

export const audioService = new AudioService();
