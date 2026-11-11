/**
 * Pure Web Audio API Generative Sound Service & Haptic Feedback
 * Zero external audio asset dependencies, guaranteed zero 404s/CORS issues.
 * Generates tactile bead taps, celestial harmonic chimes, and procedural ambient audio.
 */

import { WorldType } from '@/types';
import { ProgressionTier } from '@/utils/progression';

// Major Pentatonic scale ratios based on root: 1 (1/1), 9/8, 5/4, 3/2, 5/3, 2/1
export const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50 // C6
];

export interface AmbientLayerNodes {
  sources: (AudioNode | { stop: (when?: number) => void })[];
  gainNode: GainNode;
}

export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientMasterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;

  // Active ambient state
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private ambientVolume: number = 0.6;
  public currentWorld: WorldType = 'rain';
  public currentTier: ProgressionTier = 0;

  // Ambient layer tracking for active world
  private baseLayer: AmbientLayerNodes | null = null;
  private warmPadLayer: AmbientLayerNodes | null = null;
  private choirLayer: AmbientLayerNodes | null = null;

  /**
   * Lazily initializes the AudioContext and the master graph.
   * Master chain: sources -> masterGain -> compressor -> safe ceiling gain -> destination
   */
  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
        this.initAudioGraph(this.ctx);
      } catch {
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private initAudioGraph(ctx: AudioContext): void {
    // Master Compressor
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-24, ctx.currentTime);
    this.compressor.knee.setValueAtTime(30, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, ctx.currentTime);

    // Master Safe Ceiling Gain
    const ceilingGain = ctx.createGain();
    ceilingGain.gain.setValueAtTime(0.9, ctx.currentTime);

    // Master Gain
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, ctx.currentTime);

    // Connect Master chain
    this.masterGain.connect(this.compressor);
    this.compressor.connect(ceilingGain);
    ceilingGain.connect(ctx.destination);

    // SFX Gain bus
    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.setValueAtTime(this.sfxVolume, ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    // Ambient Master Gain bus
    this.ambientMasterGain = ctx.createGain();
    this.ambientMasterGain.gain.setValueAtTime(this.ambientVolume, ctx.currentTime);
    this.ambientMasterGain.connect(this.masterGain);

    // Procedural Reverb via Convolver
    try {
      this.convolver = ctx.createConvolver();
      this.convolver.buffer = this.generateReverbImpulse(ctx, 2.5, 2.0);
      this.reverbGain = ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0.35, ctx.currentTime);

      this.convolver.connect(this.reverbGain);
      this.reverbGain.connect(this.masterGain);
    } catch {
      // Graceful fallback if convolver generation fails
      this.convolver = null;
      this.reverbGain = null;
    }
  }

  /**
   * Generates a smooth, procedural synthetic stereo impulse response.
   */
  public generateReverbImpulse(
    ctx: AudioContext,
    duration: number = 2.5,
    decay: number = 2.0
  ): AudioBuffer {
    const sampleRate = ctx.sampleRate || 44100;
    const length = Math.floor(sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      // Exponential decay envelope
      const env = Math.exp(-n * decay);
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }

    return impulse;
  }

  /**
   * Calculate pentatonic scale frequency for a given tap count.
   * Scale rises with count and resolves to tonic (PENTATONIC_SCALE[0]) at cycle end.
   */
  public getScaleNoteFrequency(count: number, targetCount: number): number {
    if (targetCount > 0 && count >= targetCount) {
      // Resolved to tonic at cycle completion (or cycle end)
      return PENTATONIC_SCALE[0];
    }

    const scaleLen = PENTATONIC_SCALE.length;
    // Map count progressively across scale indices
    const noteIndex = (count - 1 + scaleLen) % scaleLen;
    return PENTATONIC_SCALE[noteIndex];
  }

  /**
   * Set mute status
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  /**
   * Update volumes dynamically from settings
   */
  public setVolumes(sfxVolume: number, ambientVolume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, sfxVolume));
    this.ambientVolume = Math.max(0, Math.min(1, ambientVolume));

    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.sfxGain) {
        this.sfxGain.gain.linearRampToValueAtTime(this.sfxVolume, now + 0.05);
      }
      if (this.ambientMasterGain) {
        this.ambientMasterGain.gain.linearRampToValueAtTime(this.ambientVolume, now + 0.05);
      }
    }
  }

  /**
   * Generates FM water-drop / soft bell synth tap.
   * Each tap plays the next note of the pentatonic scale, rising with count,
   * resolving to tonic on cycle end, with slight random detune and velocity jitter.
   */
  public playTapSound(count: number, targetCount: number): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const baseFreq = this.getScaleNoteFrequency(count, targetCount);

    // Randomize velocity/gain slightly (±10%) and detune slightly (±8 cents)
    const velocity = 0.35 + (Math.random() * 0.1 - 0.05);
    const detuneCents = (Math.random() * 16 - 8);

    // FM Synthesis: Carrier + Modulator
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(baseFreq, now);
    carrier.detune.setValueAtTime(detuneCents, now);

    // Modulator: 1.5x carrier frequency for subtle crystalline/metallic bell tone
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(baseFreq * 1.5, now);

    // Modulator envelope: quick decay for a tactile water-drop ping
    const modIndex = baseFreq * 0.75;
    modGain.gain.setValueAtTime(modIndex, now);
    modGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Lowpass filter for warm bell/water drop body
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(baseFreq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.35);

    // Note amplitude envelope
    const duration = 0.45;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity, now + 0.005);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Connect node graph
    carrier.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.sfxGain);

    // Wet reverb send
    if (this.convolver) {
      noteGain.connect(this.convolver);
    }

    carrier.start(now);
    modulator.start(now);
    carrier.stop(now + duration + 0.05);
    modulator.stop(now + duration + 0.05);
  }

  /**
   * Climax sound at cycle completion:
   * Swell, celestial chord bloom, reverb tail, and ambient ducking.
   */
  public playCompletionClimax(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Ambient ducking: dip ambient volume then smoothly recover
    if (this.ambientMasterGain) {
      this.ambientMasterGain.gain.cancelScheduledValues(now);
      this.ambientMasterGain.gain.setValueAtTime(this.ambientMasterGain.gain.value, now);
      this.ambientMasterGain.gain.linearRampToValueAtTime(this.ambientVolume * 0.15, now + 0.2);
      this.ambientMasterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, this.ambientVolume),
        now + 3.2
      );
    }

    // Swell & Chord bloom: Frequencies based on 432Hz harmonic sacred ratios
    // C4, E4, G4, B4, C5 (Luminous major 7th / harmonic bloom)
    const chord = [261.63, 329.63, 392.0, 493.88, 523.25, 659.25];

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() * 8 - 4), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(4500, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(400, now + 3.0);

      const delayOffset = idx * 0.04;
      const duration = 2.8 + idx * 0.3;
      const maxVol = (0.28 / (idx * 0.4 + 1));

      oscGain.gain.setValueAtTime(0.0001, now);
      // Soft swell
      oscGain.gain.linearRampToValueAtTime(maxVol, now + 0.4 + delayOffset);
      // Long tail decay
      oscGain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.sfxGain!);

      if (this.convolver) {
        oscGain.connect(this.convolver);
      }

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  /**
   * Backward-compatible sound effect trigger
   */
  public playSoundEffect(type: 'bead' | 'completion' = 'bead'): void {
    if (type === 'completion') {
      this.playCompletionClimax();
    } else {
      this.playTapSound(1, 33);
    }
  }

  // ==========================================
  // PROCEDURAL AMBIENT ENGINE PER WORLD & TIER
  // ==========================================

  /**
   * Generates white/pink noise audio buffer for rain
   */
  private createNoiseBuffer(ctx: AudioContext, duration: number = 3.0): AudioBuffer {
    const sampleRate = ctx.sampleRate || 44100;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    // Pink noise filtering approximation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.18;
    }
    return buffer;
  }

  /**
   * Starts ambient synthesis for a given world with tier layers
   */
  public setWorldAmbience(world: WorldType, tier: ProgressionTier = this.currentTier): void {
    const isWorldChange = world !== this.currentWorld;
    this.currentWorld = world;
    this.currentTier = tier;

    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.ambientMasterGain) return;

    if (isWorldChange) {
      this.crossfadeToWorld(world, tier);
    } else {
      this.updateAmbientLayersForTier(tier);
    }
  }

  /**
   * Crossfades smoothly from current ambient layers to target world
   */
  private crossfadeToWorld(world: WorldType, tier: ProgressionTier): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const fadeOutTime = 0.8;

    // Fade out current layers
    const layers = [this.baseLayer, this.warmPadLayer, this.choirLayer];
    layers.forEach((layer) => {
      if (layer) {
        try {
          layer.gainNode.gain.cancelScheduledValues(now);
          layer.gainNode.gain.setValueAtTime(layer.gainNode.gain.value, now);
          layer.gainNode.gain.linearRampToValueAtTime(0, now + fadeOutTime);
          setTimeout(() => {
            layer.sources.forEach((s) => {
              if ('stop' in s && typeof s.stop === 'function') {
                try {
                  s.stop();
                } catch {
                  // ignore
                }
              }
            });
          }, fadeOutTime * 1000 + 100);
        } catch {
          // ignore
        }
      }
    });

    this.baseLayer = null;
    this.warmPadLayer = null;
    this.choirLayer = null;

    // Start new world layers after quick fade start
    setTimeout(() => {
      this.startAmbientLayers(world, tier);
    }, 100);
  }

  /**
   * Instantiates base layer, warm pad layer, and choir layer based on world
   */
  private startAmbientLayers(world: WorldType, tier: ProgressionTier): void {
    const ctx = this.getContext();
    if (!ctx || !this.ambientMasterGain) return;

    this.baseLayer = this.buildBaseLayer(world, ctx);
    this.warmPadLayer = this.buildWarmPadLayer(world, ctx);
    this.choirLayer = this.buildChoirLayer(world, ctx);

    this.updateAmbientLayersForTier(tier);
  }

  /**
   * Base Layer:
   * - Rain: Filtered Pink Noise loop simulating distant continuous drizzle
   * - Noor: Luminous Root Drone (A2 110Hz + E3 164.8Hz)
   * - Sakina: Deep Grounding Drone (F2 87.3Hz + C3 130.8Hz)
   */
  private buildBaseLayer(world: WorldType, ctx: AudioContext): AmbientLayerNodes {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(this.ambientMasterGain!);

    const sources: (AudioNode | { stop: (when?: number) => void })[] = [];

    if (world === 'rain') {
      const noiseBuffer = this.createNoiseBuffer(ctx, 4.0);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start();
      sources.push(noiseSource);
    } else {
      const droneFreqs = world === 'noor' ? [110, 164.8] : [87.3, 130.8];
      droneFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gainNode);
        osc.start();
        sources.push(osc);
      });
    }

    return { sources, gainNode };
  }

  /**
   * Warm Pad Layer (Tier 1 & 2):
   * - Rain: Gentle high-pass rain resonance & droplet patter
   * - Noor: Warm celestial major 9th pad (C#4, E4, G#4)
   * - Sakina: Serene octave-fifth pad (A3, C4, E4)
   */
  private buildWarmPadLayer(world: WorldType, ctx: AudioContext): AmbientLayerNodes {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(this.ambientMasterGain!);

    const sources: (AudioNode | { stop: (when?: number) => void })[] = [];

    if (world === 'rain') {
      // Gentle rainfall texture
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(ctx, 3.0);
      noise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
      bandpass.Q.setValueAtTime(0.8, ctx.currentTime);

      noise.connect(bandpass);
      bandpass.connect(gainNode);
      noise.start();
      sources.push(noise);
    } else {
      const padFreqs = world === 'noor' ? [277.18, 329.63, 415.3] : [220.0, 261.63, 329.63];
      padFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gainNode);
        osc.start();
        sources.push(osc);
      });
    }

    return { sources, gainNode };
  }

  /**
   * Harmonic Choir Layer (Tier 2):
   * - Celestial overtones & shimmer
   */
  private buildChoirLayer(world: WorldType, ctx: AudioContext): AmbientLayerNodes {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(this.ambientMasterGain!);

    const sources: (AudioNode | { stop: (when?: number) => void })[] = [];
    const choirFreqs =
      world === 'rain'
        ? [523.25, 659.25]
        : world === 'noor'
        ? [554.37, 659.25, 830.61]
        : [440.0, 523.25, 659.25];

    choirFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Low frequency modulation (LFO) for breathing shimmer effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.25 + Math.random() * 0.15, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.05, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      osc.connect(oscGain);
      oscGain.connect(gainNode);

      osc.start();
      lfo.start();
      sources.push(osc);
      sources.push(lfo);
    });

    return { sources, gainNode };
  }

  /**
   * Dynamically adjust gains of ambient layers based on progression tier
   * Tier 0: Base active (0.45), WarmPad (0), Choir (0)
   * Tier 1: Base active (0.45), WarmPad (0.35), Choir (0)
   * Tier 2: Base active (0.45), WarmPad (0.35), Choir (0.28)
   */
  public updateAmbientLayersForTier(tier: ProgressionTier): void {
    this.currentTier = tier;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const fade = 0.5;

    // If layers don't exist yet, lazily create them
    if (!this.baseLayer && !this.isMuted) {
      this.startAmbientLayers(this.currentWorld, tier);
      return;
    }

    if (this.baseLayer) {
      this.baseLayer.gainNode.gain.cancelScheduledValues(now);
      this.baseLayer.gainNode.gain.linearRampToValueAtTime(0.45, now + fade);
    }

    if (this.warmPadLayer) {
      const padTarget = tier >= 1 ? 0.35 : 0.0;
      this.warmPadLayer.gainNode.gain.cancelScheduledValues(now);
      this.warmPadLayer.gainNode.gain.linearRampToValueAtTime(padTarget, now + fade);
    }

    if (this.choirLayer) {
      const choirTarget = tier >= 2 ? 0.28 : 0.0;
      this.choirLayer.gainNode.gain.cancelScheduledValues(now);
      this.choirLayer.gainNode.gain.linearRampToValueAtTime(choirTarget, now + fade);
    }
  }

  public playWorldAmbient(): void {
    this.setWorldAmbience(this.currentWorld, this.currentTier);
  }

  public stopWorldAmbient(): void {
    if (this.ambientMasterGain && this.ctx) {
      this.ambientMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
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
}

export const audioService = new AudioService();
