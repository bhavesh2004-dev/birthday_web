// Sound Effects and Audio Engine for Bitu & Bee's Birthday Portal
// Uses Web Audio API for zero-dependency, ultra-reliable playback across all browsers & devices.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmPlaying: boolean = false;
  private customSongName: string = 'Dilruba Dilnasheen 💖✨';
  private duckInterval: ReturnType<typeof setInterval> | null = null;
  private typingAudio: HTMLAudioElement | null = null;
  private isTypingPlaying: boolean = false;
  private typewriterBuffers: AudioBuffer[] = [];
  private typewriterSpaceBuffer: AudioBuffer | null = null;
  private isTypewriterLoaded: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.loadTypewriterSounds();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private async loadTypewriterSounds() {
    if (this.isTypewriterLoaded || !this.ctx) return;
    try {
      const keyFiles = [
        '/assets/typewriter_key1.wav',
        '/assets/typewriter_key2.wav',
        '/assets/typewriter_key3.wav',
        '/assets/typewriter_key4.wav',
      ];

      const loadedBuffers = await Promise.all(
        keyFiles.map(async (file) => {
          const res = await fetch(file);
          const arrayBuf = await res.arrayBuffer();
          return await this.ctx!.decodeAudioData(arrayBuf);
        })
      );
      this.typewriterBuffers = loadedBuffers;

      const spaceRes = await fetch('/assets/typewriter_space.wav');
      const spaceArrayBuf = await spaceRes.arrayBuffer();
      this.typewriterSpaceBuffer = await this.ctx.decodeAudioData(spaceArrayBuf);

      this.isTypewriterLoaded = true;
    } catch {
      this.isTypewriterLoaded = false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = muted;
    }
    if (this.typingAudio) {
      this.typingAudio.muted = muted;
    }
    if (muted) {
      if (this.isBgmPlaying) {
        this.stopBgm();
      }
      if (this.isTypingPlaying) {
        this.stopTypingSound();
      }
    } else {
      if (!this.isBgmPlaying && this.bgmAudio) {
        this.startBgm();
      }
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // Authentic Vintage Typewriter Key Clack
  public playTypewriterKey() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // 1. Play recorded high-fidelity acoustic buffer if loaded
      if (this.isTypewriterLoaded && this.typewriterBuffers.length > 0) {
        const randomIdx = Math.floor(Math.random() * this.typewriterBuffers.length);
        const buffer = this.typewriterBuffers[randomIdx];

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        // Subtle realistic pitch and speed variance per stroke
        source.playbackRate.value = 0.94 + Math.random() * 0.12;

        const gain = this.ctx.createGain();
        // Gentle, pleasant volume (not harsh or overpowering)
        gain.gain.value = 0.22 + Math.random() * 0.08;

        source.connect(gain);
        gain.connect(this.ctx.destination);

        source.start();
        return;
      }

      // 2. Real-time acoustic synthesis fallback (crisp mechanical snap + platen thud)
      const now = this.ctx.currentTime;

      // Mechanical attack click (metal key snap)
      const clickSize = Math.floor(this.ctx.sampleRate * 0.008);
      const clickBuf = this.ctx.createBuffer(1, clickSize, this.ctx.sampleRate);
      const clickData = clickBuf.getChannelData(0);
      for (let i = 0; i < clickSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickSize * 0.25));
      }
      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = clickBuf;

      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'highpass';
      clickFilter.frequency.setValueAtTime(3200 + Math.random() * 500, now);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.18, now);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickSource.start(now);

      // Platen impact thud (body resonance)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'triangle';
      const thudFreq = 260 + Math.random() * 60;
      thudOsc.frequency.setValueAtTime(thudFreq, now);
      thudOsc.frequency.exponentialRampToValueAtTime(140, now + 0.025);

      thudGain.gain.setValueAtTime(0.25, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.035);
    } catch {}
  }

  // Typewriter Spacebar / Carriage Advance Thud
  public playTypewriterSpace() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.isTypewriterLoaded && this.typewriterSpaceBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.typewriterSpaceBuffer;
        source.playbackRate.value = 0.96 + Math.random() * 0.08;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.26 + Math.random() * 0.06;

        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
        return;
      }

      // Fallback
      this.playTypewriterKey();
    } catch {}
  }

  // Alias for backward compatibility
  public playPenScratch() {
    this.playTypewriterKey();
  }

  // Romantic Velvet Acoustic Tap (Warm, organic tone that harmonizes with Kesariya)
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Primary warm acoustic body (soft marimba/kalimba strike)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      // Subtle pitch drop mimicking organic mallet strike on wood/crystal
      osc.frequency.setValueAtTime(698.46, now); // F5
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.02); // settles into D5

      // Warm acoustic lowpass filter removes any harsh electronic edges
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(1000, now + 0.07);

      // Smooth attack and soft exponential release
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // 2. Delicate acoustic overtone (crystal shine)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now); // D6 overtone

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.035, now + 0.002);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.08);
      osc2.stop(now + 0.045);
    } catch {
      // Audio not permitted yet
    }
  }

  // Romantic Music Box Chime
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = this.ctx!.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {}
  }

  // Candle Blow Sound (Gentle wind whoosh)
  public playBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.6);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.6);
    } catch {}
  }

  // Celebratory Birthday Fanfare
  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Happy Birthday opening motif: C4, C4, D4, C4, F4, E4
      const notes = [
        { f: 523.25, d: 0.18, t: 0 },
        { f: 523.25, d: 0.18, t: 0.22 },
        { f: 587.33, d: 0.35, t: 0.44 },
        { f: 523.25, d: 0.35, t: 0.82 },
        { f: 698.46, d: 0.40, t: 1.20 },
        { f: 659.25, d: 0.75, t: 1.65 },
        { f: 783.99, d: 0.20, t: 2.45 },
        { f: 1046.50, d: 0.85, t: 2.70 },
      ];

      notes.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.value = note.f;

        const start = this.ctx!.currentTime + note.t;
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + note.d + 0.05);
      });
    } catch {}
  }

  // Shimmering Magic Sparkle
  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [1046.5, 1318.51, 1567.98, 2093.0];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const start = this.ctx!.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch {}
  }

  // Playful boing sound when button dodges
  public playBoing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // Soft romantic heartbeat
  public playHeartBeat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Lub
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.1);
      gain1.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.13);

      // Dub
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(80, this.ctx.currentTime + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.28);
      gain2.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(this.ctx.currentTime + 0.15);
      osc2.stop(this.ctx.currentTime + 0.31);
    } catch {}
  }

  // Ambient Romantic Music Player (Dilruba Dilnasheen)
  public startBgm() {
    if (this.isMuted) return;
    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio('/assets/dilruba_bgm.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.55;

        // Rock-solid infinite loop fallback across all mobile & desktop browsers
        this.bgmAudio.addEventListener('ended', () => {
          if (!this.isMuted && this.bgmAudio) {
            this.bgmAudio.currentTime = 0;
            this.bgmAudio.play().catch(() => {});
          }
        });
      }
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
      }).catch((e) => {
        console.log('Audio autoplay prevented by browser until user gesture:', e);
        this.isBgmPlaying = false;
      });
    } catch {
      this.isBgmPlaying = false;
    }
  }

  public stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    this.isBgmPlaying = false;
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  // Smoothly duck background music volume (e.g. during letter typing or video)
  public duckBgm(targetVolume = 0.12, durationMs = 800) {
    if (!this.bgmAudio) {
      this.startBgm();
    }
    if (!this.bgmAudio) return;
    if (this.duckInterval) clearInterval(this.duckInterval);

    const startVol = this.bgmAudio.volume;
    const steps = 20;
    const stepTime = Math.max(12, Math.floor(durationMs / steps));
    const diff = targetVolume - startVol;
    let count = 0;

    this.duckInterval = setInterval(() => {
      count++;
      if (this.bgmAudio) {
        const nextVol = startVol + (diff * count) / steps;
        this.bgmAudio.volume = Math.max(0, Math.min(1, nextVol));
      }
      if (count >= steps) {
        if (this.duckInterval) {
          clearInterval(this.duckInterval);
          this.duckInterval = null;
        }
        if (this.bgmAudio) {
          this.bgmAudio.volume = Math.max(0, Math.min(1, targetVolume));
        }
      }
    }, stepTime);
  }

  // Smoothly restore background music volume back to normal level
  public restoreBgm(targetVolume = 0.55, durationMs = 800) {
    if (!this.bgmAudio) {
      this.startBgm();
      return;
    }
    if (this.duckInterval) clearInterval(this.duckInterval);

    const startVol = this.bgmAudio.volume;
    const steps = 20;
    const stepTime = Math.max(12, Math.floor(durationMs / steps));
    const diff = targetVolume - startVol;
    let count = 0;

    this.duckInterval = setInterval(() => {
      count++;
      if (this.bgmAudio) {
        const nextVol = startVol + (diff * count) / steps;
        this.bgmAudio.volume = Math.max(0, Math.min(1, nextVol));
      }
      if (count >= steps) {
        if (this.duckInterval) {
          clearInterval(this.duckInterval);
          this.duckInterval = null;
        }
        if (this.bgmAudio) {
          this.bgmAudio.volume = Math.max(0, Math.min(1, targetVolume));
        }
      }
    }, stepTime);
  }

  // Realistic laptop typing audio provided by user
  public startTypingSound() {
    if (this.isMuted) return;
    try {
      if (!this.typingAudio) {
        this.typingAudio = new Audio('/assets/laptop_typing.mp3');
        this.typingAudio.loop = true;
        this.typingAudio.volume = 0.42;
      }
      if (this.typingAudio.paused) {
        this.typingAudio.currentTime = 0;
        this.typingAudio.play().then(() => {
          this.isTypingPlaying = true;
        }).catch(() => {
          this.isTypingPlaying = false;
        });
      }
    } catch {}
  }

  public stopTypingSound() {
    if (this.typingAudio) {
      try {
        this.typingAudio.pause();
        this.typingAudio.currentTime = 0;
      } catch {}
    }
    this.isTypingPlaying = false;
  }

  public setCustomSong(audioUrl: string, songName: string) {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    this.bgmAudio = new Audio(audioUrl);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.55;
    this.customSongName = songName;
    if (!this.isMuted) {
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
      });
    }
  }

  public getSongName(): string {
    return this.customSongName;
  }
}

export const sounds = new SoundManager();
