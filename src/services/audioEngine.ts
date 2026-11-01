import { VocalMode, YorubaTone, YorubaSyllable } from "../types";

/**
 * Web Audio API synthesizer for Ifá Sacred Shrine Sounds, Ọpọ́n Tapping,
 * Ọ̀pẹ̀lẹ̀ Chain Clatter, Saworo Brass Bells, Talking Drum, and Panegyric (Oríkì) Tonal Chants.
 * Features Formant Vocal Tract Filters for authentic Male (Babalawo), Female (Ìyánífá), and Duet vocals
 * with Pure Yoruba Tonal System (Àmì Ohùn Yorùbá: DÒ - RE - MÍ).
 * Zero external audio file dependencies - 100% resilient and instant loading.
 */

class AudioEngineService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private backgroundLoopTimer: number | null = null;
  private isPlayingGroove: boolean = false;
  private currentBpm: number = 105;
  private activeDroneGain: GainNode | null = null;
  private currentVocalMode: VocalMode = "male";
  private isReciting: boolean = false;
  private activeChantTimer: NodeJS.Timeout | null = null;

  // Pure Yoruba Tonal Frequencies (Àmì Ohùn Yorùbá: DÒ - RE - MÍ)
  public readonly YORUBA_PITCHES = {
    male: {
      "DÒ": 130.81, // Low tone (Grave `\`) - C3
      "RE": 164.81, // Mid tone (Unmarked `-`) - E3
      "MÍ": 220.00, // High tone (Acute `/`) - A3
    },
    female: {
      "DÒ": 261.63, // Low tone (Grave `\`) - C4
      "RE": 329.63, // Mid tone (Unmarked `-`) - E4
      "MÍ": 440.00, // High tone (Acute `/`) - A4
    },
  };

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVocalMode(mode: VocalMode) {
    this.currentVocalMode = mode;
  }

  public getVocalMode(): VocalMode {
    return this.currentVocalMode;
  }

  /**
   * Play Ìrókẹ́ Ifá (Sacred Tapper striking the wooden Ọpọ́n tray)
   */
  public playIrokeTap() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Resonant wooden block strike
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    // High wood transient click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(1800, now);
    click.frequency.exponentialRampToValueAtTime(300, now + 0.03);
    clickGain.gain.setValueAtTime(0.6, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    click.start(now);
    click.stop(now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Play Ọ̀pẹ̀lẹ̀ Divining Chain Clatter (8 seeds rattling onto mat)
   */
  public playOpeleCast() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const seedPitches = [420, 510, 630, 480, 720, 390, 560, 680];

    seedPitches.forEach((pitch, i) => {
      const delay = now + i * 0.025 + (Math.random() * 0.015);
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(pitch, delay);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, delay + 0.08);

      gain.gain.setValueAtTime(0.35, delay);
      gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(delay);
      osc.stop(delay + 0.1);
    });
  }

  /**
   * Play Saworo (Sacred Brass Priest Bells)
   */
  public playSaworoChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const freqs = [1174.66, 1760.0, 2349.32]; // D6, A6, D7

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.4 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  /**
   * Synthesize Male Babalawo Vocal (Deep, resonant chest voice with rich throat harmonics and vibrato)
   */
  public playMaleVocal(baseFreq: number, duration: number = 0.55) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Map frequency to masculine range (110Hz - 190Hz root)
    const maleFreq = baseFreq > 220 ? baseFreq * 0.5 : baseFreq;

    // Glottal source: Sawtooth + Square blend
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator(); // Vibrato
    const lfoGain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(maleFreq, now);
    osc.frequency.linearRampToValueAtTime(maleFreq * 1.02, now + duration * 0.3);
    osc.frequency.linearRampToValueAtTime(maleFreq, now + duration);

    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(maleFreq * 0.5, now); // Chest sub-harmonic

    // Natural vocal vibrato (5.2 Hz)
    lfo.frequency.setValueAtTime(5.2, now);
    lfoGain.gain.setValueAtTime(3.5, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    // Male Vocal Tract Formant Filters: F1 (550Hz), F2 (1200Hz), F3 (2400Hz)
    const f1 = this.ctx.createBiquadFilter();
    f1.type = "bandpass";
    f1.frequency.setValueAtTime(550, now);
    f1.Q.setValueAtTime(4.5, now);

    const f2 = this.ctx.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.setValueAtTime(1200, now);
    f2.Q.setValueAtTime(6.0, now);

    const f3 = this.ctx.createBiquadFilter();
    f3.type = "lowpass";
    f3.frequency.setValueAtTime(2600, now);

    // Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.65, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.4, now + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Routing
    osc.connect(f1);
    osc.connect(f2);
    subOsc.connect(f3);

    f1.connect(gain);
    f2.connect(gain);
    f3.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.05);
    subOsc.stop(now + duration + 0.05);
  }

  /**
   * Synthesize Female Ìyánífá / Arókin Vocal (Lyrical, soaring praise chanter with bright harmonic clarity)
   */
  public playFemaleVocal(baseFreq: number, duration: number = 0.55) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Map frequency to feminine range (240Hz - 440Hz)
    const femaleFreq = baseFreq < 200 ? baseFreq * 1.8 : baseFreq;

    // Vocal source: Rich sine + triangle with high overtone air
    const osc = this.ctx.createOscillator();
    const airOsc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator(); // Shimmer vibrato
    const lfoGain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(femaleFreq, now);
    osc.frequency.linearRampToValueAtTime(femaleFreq * 1.04, now + 0.12);
    osc.frequency.linearRampToValueAtTime(femaleFreq, now + duration);

    airOsc.type = "sine";
    airOsc.frequency.setValueAtTime(femaleFreq * 2.0, now); // Luminous octave

    // Fast lyrical vibrato (5.9 Hz)
    lfo.frequency.setValueAtTime(5.9, now);
    lfoGain.gain.setValueAtTime(5.0, now);
    lfo.connect(osc.frequency);
    lfo.connect(airOsc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    // Female Vocal Tract Formant Filters: F1 (820Hz), F2 (1950Hz), F3 (3200Hz)
    const f1 = this.ctx.createBiquadFilter();
    f1.type = "bandpass";
    f1.frequency.setValueAtTime(820, now);
    f1.Q.setValueAtTime(5.0, now);

    const f2 = this.ctx.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.setValueAtTime(1950, now);
    f2.Q.setValueAtTime(7.0, now);

    const highPassAir = this.ctx.createBiquadFilter();
    highPassAir.type = "highpass";
    highPassAir.frequency.setValueAtTime(1600, now);

    // Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.35, now + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Routing
    osc.connect(f1);
    osc.connect(f2);
    airOsc.connect(highPassAir);

    f1.connect(gain);
    f2.connect(gain);
    highPassAir.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    airOsc.start(now);
    osc.stop(now + duration + 0.05);
    airOsc.stop(now + duration + 0.05);
  }

  /**
   * Synthesize Sacred Duet (Male Babalawo & Female Ìyánífá chanting in sacred antiphonal harmony)
   */
  public playDuetVocal(baseFreq: number, duration: number = 0.6) {
    this.playMaleVocal(baseFreq, duration);
    this.playFemaleVocal(baseFreq * 1.5, duration);
  }

  /**
   * Parse any Yoruba text into its constituent phonetic syllables and authentic Yoruba tones (Àmì Ohùn: DÒ, RE, MÍ).
   */
  public parseYorubaTextToSyllablesAndTones(text: string): YorubaSyllable[] {
    const cleanText = text.trim();
    if (!cleanText) return [];

    const syllables: YorubaSyllable[] = [];
    const words = cleanText.split(/\s+/);

    const lowTonePattern = /[àèẹ̀è̩ìòọ̀ò̩ùǹm̀]|\u0300/i;
    const highTonePattern = /[áéẹ́é̩íóọ́ó̩úńḿ]|\u0301/i;

    // Yoruba vowels and syllabic nasals regex
    const yorubaSyllableRegex = /([bdfghjklmnprstwygbkpṣ]*[aáàeéèẹẹ́ẹ̀iíìoóòọọ́ọ̀uúù]+[nm]?|[nmńǹḿm̀])/gi;

    for (const word of words) {
      // Strip punctuation for analysis but keep token
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()"'""'']/g, "");
      if (!cleanWord) continue;

      const matches = cleanWord.match(yorubaSyllableRegex) || [cleanWord];

      for (const syl of matches) {
        let tone: YorubaTone = "RE";
        let accentMark: "\\" | "-" | "/" = "-";

        if (lowTonePattern.test(syl)) {
          tone = "DÒ";
          accentMark = "\\";
        } else if (highTonePattern.test(syl)) {
          tone = "MÍ";
          accentMark = "/";
        } else {
          tone = "RE";
          accentMark = "-";
        }

        syllables.push({
          syllable: syl,
          tone,
          accentMark,
          pitchHz: {
            male: this.YORUBA_PITCHES.male[tone],
            female: this.YORUBA_PITCHES.female[tone],
          },
        });
      }
    }

    return syllables;
  }

  /**
   * Play a Pure Yoruba Tone (Àmì Ohùn Yorùbá):
   * - DÒ: Grave Low Tone (\)
   * - RE: Unmarked Mid Tone (-)
   * - MÍ: Acute High Tone (/)
   */
  public playPureYorubaTone(
    tone: YorubaTone,
    voiceOverride?: VocalMode,
    duration: number = 0.55
  ) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const activeVoice = voiceOverride || this.currentVocalMode;
    const freq =
      activeVoice === "male"
        ? this.YORUBA_PITCHES.male[tone]
        : activeVoice === "female"
        ? this.YORUBA_PITCHES.female[tone]
        : (this.YORUBA_PITCHES.male[tone] + this.YORUBA_PITCHES.female[tone]) / 2;

    if (activeVoice === "male") {
      this.playMaleVocal(freq, duration);
    } else if (activeVoice === "female") {
      this.playFemaleVocal(freq, duration);
    } else {
      this.playDuetVocal(freq, duration);
    }
  }

  /**
   * Play Oríkì Vocal Tone for Panegyric Recitation with selected voice (mapped to Pure Yoruba DÒ-RE-MÍ)
   */
  public playToneChant(
    tone: "LOW" | "MID" | "HIGH",
    customFreq?: number,
    voiceOverride?: VocalMode
  ) {
    const yorubaTone: YorubaTone =
      tone === "LOW" ? "DÒ" : tone === "MID" ? "RE" : "MÍ";
    
    if (customFreq) {
      const activeVoice = voiceOverride || this.currentVocalMode;
      if (activeVoice === "male") this.playMaleVocal(customFreq, 0.55);
      else if (activeVoice === "female") this.playFemaleVocal(customFreq, 0.55);
      else this.playDuetVocal(customFreq, 0.6);
    } else {
      this.playPureYorubaTone(yorubaTone, voiceOverride, 0.55);
    }
  }

  /**
   * Chant a Pure Yoruba Panegyric verse with authentic syllable-by-syllable tonal pitch portamento,
   * natural Yoruba acoustic vocal formants, and sacred bell accompaniment.
   */
  public async chantPureYorubaVerse(
    verseText: string,
    voiceOverride?: VocalMode,
    onSyllableChange?: (syllableIdx: number) => void,
    onComplete?: () => void
  ) {
    this.initContext();
    this.stopVocalRecitation();
    this.isReciting = true;

    const activeVoice = voiceOverride || this.currentVocalMode;
    const syllables = this.parseYorubaTextToSyllablesAndTones(verseText);

    // Initial sacred saworo chime
    this.playSaworoChime();
    await new Promise((r) => setTimeout(r, 220));

    // Syllable duration for chanting cadence
    const syllableDuration = 0.38; // seconds per syllable

    for (let i = 0; i < syllables.length; i++) {
      if (!this.isReciting) break;

      const syl = syllables[i];
      if (onSyllableChange) onSyllableChange(i);

      // Play pure Yoruba acoustic tone for this exact syllable
      this.playPureYorubaTone(syl.tone, activeVoice, syllableDuration * 0.95);

      // Subtle talking drum or saworo pulse on High/Low accents
      if (syl.tone === "MÍ" && i % 3 === 0) {
        this.playTalkingDrum("HIGH");
      } else if (syl.tone === "DÒ" && i % 4 === 0) {
        this.playTalkingDrum("LOW");
      }

      await new Promise((resolve) => setTimeout(resolve, syllableDuration * 1000));
    }

    this.isReciting = false;
    if (onComplete) onComplete();
  }

  /**
   * Recite a complete Yoruba Panegyric / Oríkì verse aloud with vocal style,
   * speech synthesis articulation, acoustic drone resonance, and tonal accents.
   */
  public async recitePanegyricVerse(
    verseText: string,
    voiceOverride?: VocalMode,
    tones?: Array<"LOW" | "MID" | "HIGH">,
    onComplete?: () => void
  ) {
    this.initContext();
    this.stopVocalRecitation();
    const activeVoice = voiceOverride || this.currentVocalMode;

    // Play initial priest bell / saworo chime
    this.playSaworoChime();

    // Check if SpeechSynthesis is available in browser
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(verseText);
      // Look for suitable African or English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.includes("yo") || v.lang.includes("ng") || v.lang.includes("en-NG")) ||
        voices.find((v) =>
          activeVoice === "female"
            ? v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha")
            : v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("george")
        );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Authentic Yoruba cadence tuning
      if (activeVoice === "female") {
        utterance.pitch = 1.25;
        utterance.rate = 0.84;
      } else if (activeVoice === "male") {
        utterance.pitch = 0.78;
        utterance.rate = 0.80;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 0.82;
      }

      this.isReciting = true;

      // Extract syllables & play background pure Yoruba tonal accompaniment in sync with speech
      const parsedSyllables = this.parseYorubaTextToSyllablesAndTones(verseText);
      if (parsedSyllables.length > 0) {
        parsedSyllables.forEach((syl, idx) => {
          setTimeout(() => {
            if (this.isReciting) {
              this.playPureYorubaTone(syl.tone, activeVoice, 0.32);
            }
          }, idx * 340);
        });
      } else if (tones && tones.length > 0) {
        tones.forEach((tone, idx) => {
          setTimeout(() => {
            if (this.isReciting) {
              this.playToneChant(tone, undefined, activeVoice);
            }
          }, idx * 450);
        });
      } else {
        this.playToneChant("MID", undefined, activeVoice);
      }

      utterance.onend = () => {
        this.isReciting = false;
        if (onComplete) onComplete();
      };

      utterance.onerror = () => {
        this.isReciting = false;
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: Pure Yoruba syllabic chant
      await this.chantPureYorubaVerse(verseText, activeVoice, undefined, onComplete);
    }
  }

  /**
   * Stop active recitation
   */
  public stopVocalRecitation() {
    this.isReciting = false;
    if (this.activeChantTimer) {
      clearTimeout(this.activeChantTimer);
      this.activeChantTimer = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Play Ìyẹ̀ròsùn Dust marking sound (gentle powder touch)
   */
  public playIyerosunDust() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Play Ebọ & Wisdom Resolution Chord (Harmonic epiphany)
   */
  public playEboBlessing() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Major pentatonic sacred chord: C4, E4, G4, A4, C5
    const chord = [261.63, 329.63, 392.0, 440.0, 523.25];

    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.01, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + idx * 0.06);
      osc.stop(now + 1.3);
    });
  }

  /**
   * Play Talking Drum (Dun-Dun)
   */
  public playTalkingDrum(tone: "LOW" | "MID" | "HIGH" | "SHEKERE", pitchOffset: number = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    if (tone === "SHEKERE") {
      this.playShekere();
      return;
    }

    if (tone === "LOW") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 85 + pitchOffset;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.28);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (tone === "MID") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 165 + pitchOffset;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.15, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.25);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.32);
    } else {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 260 + pitchOffset;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.4, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.1, now + 0.26);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  public playShekere() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }
}

export const audioEngine = new AudioEngineService();
