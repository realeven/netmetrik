// ============================================================================
// NetMetrik Tactile Audio & Haptic Sound Engine (Web Audio API)
// Deep, muffled, quiet "tok" acoustic sounds (low frequency, low gain)
// Designed for quiet studying with zero ear fatigue
// ============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('netmetrik_sound_muted');
      this.muted = savedMute === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('netmetrik_sound_muted', muted ? 'true' : 'false');
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Helper to create a warm low-pass filter that eliminates all high-pitched hiss & harshness
   */
  private createLowPass(ctx: AudioContext, cutoff: number = 280): BiquadFilterNode {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);
    return filter;
  }

  /**
   * Tok, sessiz ve tatmin edici dokunsal buton vuruşu (Soft dampened haptic tap)
   * 130Hz -> 65Hz alçak frekans, düşük ses seviyesi (gain ~0.025), 25ms
   */
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = this.createLowPass(ctx, 260);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.025);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio autoplay policy fail-safe
    }
  }

  /**
   * Tok ve pürüzsüz sekme/ekran geçiş sesi (Muffled soft sweep)
   * 100Hz -> 55Hz, çok alçak ses, 35ms
   */
  public playTabSwitch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = this.createLowPass(ctx, 200);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(105, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.035);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  /**
   * Çift tok vuruş (Ahşap dokulu minik tema geçişi)
   */
  public playThemeSwitch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [120, 150];
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.03;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = this.createLowPass(ctx, 260);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.035);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      });
    } catch {}
  }

  /**
   * Sıcak, tok çift marimba vuruşu (Başarı / Görev / Deneme tamamlama)
   * Asla tiz veya rahatsız edici olmayan bas ikili (146Hz & 196Hz)
   */
  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [146.83, 196.0]; // D3, G3
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = this.createLowPass(ctx, 300);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.05);

        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      });
    } catch {}
  }

  /**
   * Sakinleştirici, tok ve derin Tibet çanı / gong tınısı (Pomodoro bitişi)
   * 130Hz alçak frekans, yumuşak sönümlenme
   */
  public playPomodoroChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = this.createLowPass(ctx, 240);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(138.59, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.65);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.68);
    } catch {}
  }

  /**
   * Alçak frekanslı tok toggle vuruşu (Liste ve konu durumu)
   */
  public playToggle(checked: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = this.createLowPass(ctx, 220);

      osc.type = 'sine';
      const startFreq = checked ? 140 : 95;
      const endFreq = checked ? 85 : 55;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.022);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch {}
  }
}

export const sounds = new SoundEngine();
