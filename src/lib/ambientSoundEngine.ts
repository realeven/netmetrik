/**
 * Web Audio API Ambient Sound Generator & Mixer
 * Generates high-fidelity atmospheric study soundscapes offline without external audio files.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundNodes: Map<string, { gain: GainNode; stop: () => void }> = new Map();
  private isMuted: boolean = false;
  private masterVolume: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setSoundVolume(soundId: string, volume: number) {
    this.initContext();
    const clamped = Math.max(0, Math.min(1, volume));
    const active = this.soundNodes.get(soundId);

    if (clamped > 0) {
      if (!active) {
        this.startSound(soundId, clamped);
      } else if (this.ctx) {
        active.gain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      }
    } else if (active) {
      active.stop();
      this.soundNodes.delete(soundId);
    }
  }

  public stopAll() {
    this.soundNodes.forEach((node) => node.stop());
    this.soundNodes.clear();
  }

  // --- Sound Generators ---

  private startSound(id: string, initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(initialVol, ctx.currentTime);
    gainNode.connect(this.masterGain);

    let stopFn = () => {};

    switch (id) {
      case 'rain': {
        // Rain: Pink/Brown noise + droplet clicks
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        whiteNoise.start();

        stopFn = () => {
          try {
            whiteNoise.stop();
            whiteNoise.disconnect();
          } catch {}
        };
        break;
      }

      case 'waves': {
        // Ocean Waves: Lowpass filtered noise with undulating LFO gain
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec ocean swell
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.4, ctx.currentTime);

        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.5, ctx.currentTime);

        lfo.connect(waveGain.gain);
        source.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(gainNode);

        source.start();
        lfo.start();

        stopFn = () => {
          try {
            source.stop();
            lfo.stop();
            source.disconnect();
            lfo.disconnect();
          } catch {}
        };
        break;
      }

      case 'fire': {
        // Fireplace: Low rumble + randomized crackle impulses
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Low warm rumble with occasional pops
          const rumble = (Math.random() * 2 - 1) * 0.15;
          const pop = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.9 : 0;
          data[i] = rumble + pop;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        source.start();

        stopFn = () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'birds': {
        // Forest & Birds: Gentle high pass breeze + chirps
        const osc1 = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2400, ctx.currentTime);

        // LFO for periodic pleasant bird song
        const chirpLfo = ctx.createOscillator();
        chirpLfo.type = 'triangle';
        chirpLfo.frequency.setValueAtTime(0.3, ctx.currentTime);

        const chirpLfoGain = ctx.createGain();
        chirpLfoGain.gain.setValueAtTime(400, ctx.currentTime);
        chirpLfo.connect(chirpLfoGain);
        chirpLfoGain.connect(osc1.frequency);

        oscGain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc1.connect(oscGain);
        oscGain.connect(gainNode);

        osc1.start();
        chirpLfo.start();

        stopFn = () => {
          try {
            osc1.stop();
            chirpLfo.stop();
            osc1.disconnect();
          } catch {}
        };
        break;
      }

      case 'cafe': {
        // Cozy Cafe: Low-mid warm chatter resonance
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter1 = ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(600, ctx.currentTime);
        filter1.Q.setValueAtTime(2.0, ctx.currentTime);

        source.connect(filter1);
        filter1.connect(gainNode);
        source.start();

        stopFn = () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'crickets': {
        // Night Crickets: Dual high-frequency oscillators pulsing
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500, ctx.currentTime);

        const pulseLfo = ctx.createOscillator();
        pulseLfo.type = 'square';
        pulseLfo.frequency.setValueAtTime(5, ctx.currentTime);

        const pulseGain = ctx.createGain();
        pulseGain.gain.setValueAtTime(0.07, ctx.currentTime);

        pulseLfo.connect(pulseGain.gain);
        osc.connect(pulseGain);
        pulseGain.connect(gainNode);

        osc.start();
        pulseLfo.start();

        stopFn = () => {
          try {
            osc.stop();
            pulseLfo.stop();
            osc.disconnect();
          } catch {}
        };
        break;
      }

      case 'noise': {
        // Deep Brown Noise (Focus masking)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.0;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        source.connect(gainNode);
        source.start();

        stopFn = () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'lofi': {
        // Lo-Fi Warm Harmonic Pad / Rhodes Drone
        const chordFreqs = [220, 261.63, 329.63, 392.0]; // Am7 chord
        const oscs: OscillatorNode[] = [];
        const padGain = ctx.createGain();
        padGain.gain.setValueAtTime(0.08, ctx.currentTime);

        chordFreqs.forEach((freq) => {
          const osc = ctx!.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx!.currentTime);

          // Subtle vibrato/detune for vinyl aesthetic
          const vibrato = ctx!.createOscillator();
          vibrato.frequency.setValueAtTime(0.5, ctx!.currentTime);
          const vibGain = ctx!.createGain();
          vibGain.gain.setValueAtTime(1.5, ctx!.currentTime);
          vibrato.connect(vibGain);
          vibGain.connect(osc.frequency);

          osc.connect(padGain);
          osc.start();
          vibrato.start();
          oscs.push(osc, vibrato);
        });

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, ctx.currentTime);

        padGain.connect(filter);
        filter.connect(gainNode);

        stopFn = () => {
          oscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch {}
          });
        };
        break;
      }

      default:
        break;
    }

    this.soundNodes.set(id, { gain: gainNode, stop: stopFn });
  }

  /**
   * Plays a pleasant Tibetan Singing Bowl / Zen Gong chime on session completion
   */
  public playZenChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const fundamental = 432; // 432 Hz healing tuning
    const harmonics = [1, 2.01, 3.02, 4.15];
    const weights = [1, 0.45, 0.2, 0.08];

    harmonics.forEach((h, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * h, now);

      const amp = weights[idx] * 0.35;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 4.8);
    });
  }

  /**
   * Plays a soft clock tick for metronome focus
   */
  public playSoftTick() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const ambientEngine = new AmbientAudioEngine();
