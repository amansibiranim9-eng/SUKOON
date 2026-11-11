/**
 * Audio service layer for ambient soundscapes and subtle Dhikr feedback
 * Uses Web Audio API for organic generative audio without external assets
 */
class AudioService {
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private audioCtx: AudioContext | null = null;

  public init(): void {
    if (typeof window !== 'undefined' && !this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      this.init();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  /**
   * Generates a warm, organic wooden tasbih bead tap
   */
  public playSoundEffect(name: string = 'bead'): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      if (name === 'completion') {
        // Serene meditation singing bowl / chime on completing a cycle
        const now = ctx.currentTime;
        const fundamental = 432; // Harmonic 432Hz tuning

        [1, 1.5, 2.02, 2.76].forEach((harmonic, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * harmonic, now);

          const decay = 2.5 - idx * 0.4;
          const initialGain = (0.2 / (idx + 1)) * this.volume;

          gain.gain.setValueAtTime(initialGain, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + decay);
        });
        return;
      }

      // Organic wooden bead tap
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignore audio synthesis errors on unsupported browsers
    }
  }

  public triggerHaptic(type: 'light' | 'medium' | 'completion' = 'light'): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'completion') {
          navigator.vibrate([30, 60, 40]);
        } else if (type === 'medium') {
          navigator.vibrate(25);
        } else {
          navigator.vibrate(12);
        }
      } catch {
        // Ignore haptic errors
      }
    }
  }

  public switchAmbientWorld(worldId: string): void {
    void worldId;
  }
}

export const audioService = new AudioService();
