import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioService, PENTATONIC_SCALE } from '../audioService';

// Mock Web Audio API
class MockAudioNode {
  connect = vi.fn().mockReturnValue(this);
  disconnect = vi.fn();
}

class MockAudioParam {
  value = 1;
  setValueAtTime = vi.fn().mockReturnThis();
  linearRampToValueAtTime = vi.fn().mockReturnThis();
  exponentialRampToValueAtTime = vi.fn().mockReturnThis();
  cancelScheduledValues = vi.fn().mockReturnThis();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockOscillatorNode extends MockAudioNode {
  frequency = new MockAudioParam();
  detune = new MockAudioParam();
  type = 'sine';
  start = vi.fn();
  stop = vi.fn();
}

class MockBiquadFilterNode extends MockAudioNode {
  frequency = new MockAudioParam();
  Q = new MockAudioParam();
  type = 'lowpass';
}

class MockDynamicsCompressorNode extends MockAudioNode {
  threshold = new MockAudioParam();
  knee = new MockAudioParam();
  ratio = new MockAudioParam();
  attack = new MockAudioParam();
  release = new MockAudioParam();
}

class MockAudioBuffer {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  data: Float32Array;

  constructor(numberOfChannels: number, length: number, sampleRate: number) {
    this.numberOfChannels = numberOfChannels;
    this.sampleRate = sampleRate;
    this.duration = length / sampleRate;
    this.data = new Float32Array(length);
  }

  getChannelData() {
    return this.data;
  }
}

class MockBufferSourceNode extends MockAudioNode {
  buffer: MockAudioBuffer | null = null;
  loop = false;
  start = vi.fn();
  stop = vi.fn();
}

class MockConvolverNode extends MockAudioNode {
  buffer: MockAudioBuffer | null = null;
}

class MockAudioContext {
  state: AudioContextState = 'suspended';
  currentTime = 0;
  sampleRate = 44100;
  destination = new MockAudioNode();

  createGain = vi.fn(() => new MockGainNode());
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createDynamicsCompressor = vi.fn(() => new MockDynamicsCompressorNode());
  createBuffer = vi.fn(
    (channels: number, length: number, sampleRate: number) =>
      new MockAudioBuffer(channels, length, sampleRate)
  );
  createBufferSource = vi.fn(() => new MockBufferSourceNode());
  createConvolver = vi.fn(() => new MockConvolverNode());

  resume = vi.fn().mockImplementation(async () => {
    this.state = 'running';
  });
}

describe('AudioService', () => {
  let audioService: AudioService;

  beforeEach(() => {
    vi.stubGlobal('AudioContext', MockAudioContext);
    audioService = new AudioService();
  });

  describe('Scale note calculation', () => {
    it('returns pentatonic notes rising with count', () => {
      const f1 = audioService.getScaleNoteFrequency(1, 33);
      const f2 = audioService.getScaleNoteFrequency(2, 33);
      const f3 = audioService.getScaleNoteFrequency(3, 33);

      expect(f1).toBe(PENTATONIC_SCALE[0]); // C4
      expect(f2).toBe(PENTATONIC_SCALE[1]); // D4
      expect(f3).toBe(PENTATONIC_SCALE[2]); // E4
    });

    it('wraps cyclically across pentatonic scale indices', () => {
      const scaleLen = PENTATONIC_SCALE.length;
      const fWrap = audioService.getScaleNoteFrequency(scaleLen + 1, 100);
      expect(fWrap).toBe(PENTATONIC_SCALE[0]);
    });

    it('resolves to the tonic frequency on cycle end/completion', () => {
      const target = 33;
      const completionFreq = audioService.getScaleNoteFrequency(33, target);
      expect(completionFreq).toBe(PENTATONIC_SCALE[0]);
    });
  });

  describe('Lazy AudioContext & Graph Initialization', () => {
    it('lazily initializes AudioContext on first getContext() call', () => {
      expect(audioService['ctx']).toBeNull();
      const ctx = audioService.getContext();
      expect(ctx).not.toBeNull();
      expect(audioService['compressor']).not.toBeNull();
      expect(audioService['masterGain']).not.toBeNull();
    });

    it('calls resume when AudioContext state is suspended', () => {
      const ctx = audioService.getContext();
      expect(ctx?.resume).toHaveBeenCalled();
    });
  });

  describe('Mute and Volume controls', () => {
    it('mutes master gain when setMuted(true) is called', () => {
      audioService.getContext();
      audioService.setMuted(true);
      expect(audioService['masterGain']?.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    });

    it('unmutes master gain when setMuted(false) is called', () => {
      audioService.getContext();
      audioService.setMuted(true);
      audioService.setMuted(false);
      expect(audioService['masterGain']?.gain.setValueAtTime).toHaveBeenCalledWith(1, 0);
    });

    it('adjusts SFX and ambient volumes with setVolumes', () => {
      audioService.getContext();
      audioService.setVolumes(0.5, 0.3);
      expect(audioService['sfxGain']?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.5, 0.05);
      expect(audioService['ambientMasterGain']?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
        0.3,
        0.05
      );
    });
  });

  describe('Procedural Tap and Completion Climax', () => {
    it('does not produce sound when muted', () => {
      audioService.setMuted(true);
      const ctx = audioService.getContext() as unknown as MockAudioContext;
      const initialOscCalls = ctx.createOscillator.mock.calls.length;

      audioService.playTapSound(5, 33);
      expect(ctx.createOscillator.mock.calls.length).toBe(initialOscCalls);
    });

    it('creates oscillators and gain envelopes for tap sound', () => {
      const ctx = audioService.getContext() as unknown as MockAudioContext;
      const oscCountBefore = ctx.createOscillator.mock.calls.length;

      audioService.playTapSound(2, 33);

      // Tap uses 2 oscillators (carrier + modulator)
      expect(ctx.createOscillator.mock.calls.length).toBe(oscCountBefore + 2);
    });

    it('creates multi-voice chord bloom and ducks ambience on completion climax', () => {
      const ctx = audioService.getContext() as unknown as MockAudioContext;
      const oscCountBefore = ctx.createOscillator.mock.calls.length;

      audioService.playCompletionClimax();

      // Climax chord has 6 voices
      expect(ctx.createOscillator.mock.calls.length).toBe(oscCountBefore + 6);
      expect(audioService['ambientMasterGain']?.gain.linearRampToValueAtTime).toHaveBeenCalled();
    });
  });

  describe('Ambient layers & Tier progression', () => {
    it('configures ambient layers according to progression tier', () => {
      audioService.getContext();
      audioService.setWorldAmbience('noor', 0);

      expect(audioService.currentWorld).toBe('noor');
      expect(audioService.currentTier).toBe(0);

      // Update to tier 1
      audioService.updateAmbientLayersForTier(1);
      expect(audioService['warmPadLayer']?.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
        0.35,
        expect.any(Number)
      );

      // Update to tier 2
      audioService.updateAmbientLayersForTier(2);
      expect(audioService['choirLayer']?.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
        0.28,
        expect.any(Number)
      );
    });

    it('crossfades when switching worlds', () => {
      audioService.getContext();
      audioService.setWorldAmbience('rain', 0);
      const prevBaseLayer = audioService['baseLayer'];

      audioService.setWorldAmbience('sakina', 0);
      expect(audioService.currentWorld).toBe('sakina');
      expect(prevBaseLayer?.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
        0,
        expect.any(Number)
      );
    });
  });
});
