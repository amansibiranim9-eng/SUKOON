/**
 * On-Device Voice-Reactive Service
 *
 * Privacy Notice:
 * Audio is processed strictly on-device in real-time via Web Audio API AnalyserNode.
 * No audio is ever recorded, stored, transcribed, or transmitted over any network.
 */

export type VoicePermissionState = 'idle' | 'prompt' | 'granted' | 'denied' | 'unsupported';

type LoudnessCallback = (loudness: number) => void;
type UtteranceCallback = () => void;

export class VoiceService {
  private mediaStream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;

  public permissionState: VoicePermissionState = 'idle';
  public isListening: boolean = false;

  // Smoothing and utterance peak detection
  private smoothedLoudness: number = 0;
  private baselineLoudness: number = 0.05;
  private adaptiveThreshold: number = 0.22;
  private lastUtteranceTime: number = 0;
  private debounceMs: number = 850; // debounce between Dhikr words

  // Manual sensitivity multiplier (0.1 to 2.0)
  public sensitivityMultiplier: number = 1.0;

  private loudnessListeners: Set<LoudnessCallback> = new Set();
  private utteranceListeners: Set<UtteranceCallback> = new Set();

  /**
   * Request microphone access and start on-device analysis
   */
  public async startListening(): Promise<boolean> {
    if (this.isListening) return true;

    if (
      typeof window === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      this.permissionState = 'unsupported';
      return false;
    }

    try {
      this.permissionState = 'prompt';
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      this.mediaStream = stream;
      this.permissionState = 'granted';

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioCtx.createMediaStreamSource(stream);
      this.sourceNode.connect(this.analyser);

      this.isListening = true;
      this.startAnalysisLoop();
      return true;
    } catch {
      this.permissionState = 'denied';
      this.stopListening();
      return false;
    }
  }

  /**
   * Stop analysis loop and release microphone hardware tracks completely
   */
  public stopListening(): void {
    this.isListening = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      this.mediaStream = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {
        // ignore
      }
      this.audioCtx = null;
    }

    this.analyser = null;
    this.smoothedLoudness = 0;
  }

  private startAnalysisLoop(): void {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudio = () => {
      if (!this.isListening || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      // Compute RMS loudness from frequency bins
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength) / 255; // 0.0 to 1.0

      // Smooth loudness
      const instantLoudness = Math.min(1.0, rms * 2.2 * this.sensitivityMultiplier);
      this.smoothedLoudness += (instantLoudness - this.smoothedLoudness) * 0.25;

      // Slowly adapt baseline ambient room noise
      this.baselineLoudness += (instantLoudness - this.baselineLoudness) * 0.02;
      this.adaptiveThreshold = Math.max(0.14, this.baselineLoudness * 1.6 + 0.1);

      // Notify loudness listeners (feeds world intensity)
      this.loudnessListeners.forEach((listener) => {
        try {
          listener(this.smoothedLoudness);
        } catch {
          // ignore
        }
      });

      // Detect deliberate utterance peak for dhikr counting
      const now = performance.now();
      if (
        this.smoothedLoudness > this.adaptiveThreshold &&
        now - this.lastUtteranceTime > this.debounceMs
      ) {
        this.lastUtteranceTime = now;
        this.utteranceListeners.forEach((listener) => {
          try {
            listener();
          } catch {
            // ignore
          }
        });
      }

      this.animationFrameId = requestAnimationFrame(checkAudio);
    };

    this.animationFrameId = requestAnimationFrame(checkAudio);
  }

  public onLoudness(callback: LoudnessCallback): () => void {
    this.loudnessListeners.add(callback);
    return () => {
      this.loudnessListeners.delete(callback);
    };
  }

  public onUtterance(callback: UtteranceCallback): () => void {
    this.utteranceListeners.add(callback);
    return () => {
      this.utteranceListeners.delete(callback);
    };
  }

  public setSensitivity(sensitivity: number): void {
    // Maps 0.0 - 1.0 to multiplier 0.4 - 2.2
    this.sensitivityMultiplier = 0.4 + sensitivity * 1.8;
  }
}

export const voiceService = new VoiceService();
