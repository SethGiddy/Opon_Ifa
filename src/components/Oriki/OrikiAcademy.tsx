import React, { useState } from "react";
import { PanegyricOrikiLesson, VocalMode, YorubaTone, YorubaSyllable } from "../../types";
import { ORIKI_LESSONS } from "../../data/ifaData";
import { audioEngine } from "../../services/audioEngine";
import { Volume2, BookOpen, Sparkles, Feather, Music, Award, Play, Square, Mic, Users, Heart, Disc } from "lucide-react";

export const OrikiAcademy: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson_ori");
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number | null>(null);
  const [isPracticingAll, setIsPracticingAll] = useState<boolean>(false);
  const [vocalVoice, setVocalVoice] = useState<VocalMode>("male");
  const [activePlayingMode, setActivePlayingMode] = useState<"pure_chant" | "recite" | "tone" | null>(null);

  const currentLesson =
    ORIKI_LESSONS.find((l) => l.id === selectedLessonId) || ORIKI_LESSONS[0];

  const handleVoiceChange = (voice: VocalMode) => {
    setVocalVoice(voice);
    audioEngine.setVocalMode(voice);
    if (voice === "male") {
      audioEngine.playMaleVocal(140, 0.4);
    } else if (voice === "female") {
      audioEngine.playFemaleVocal(300, 0.4);
    } else {
      audioEngine.playDuetVocal(180, 0.5);
    }
  };

  const playPureYorubaTonalChant = (lineIdx: number) => {
    setActiveLineIdx(lineIdx);
    setActivePlayingMode("pure_chant");
    const verse = currentLesson.yorubaVerses[lineIdx];

    audioEngine.chantPureYorubaVerse(
      verse.line,
      vocalVoice,
      (sylIdx) => setActiveSyllableIdx(sylIdx),
      () => {
        setActiveLineIdx(null);
        setActiveSyllableIdx(null);
        setActivePlayingMode(null);
      }
    );
  };

  const playVerseTone = (lineIdx: number) => {
    setActiveLineIdx(lineIdx);
    setActivePlayingMode("tone");
    const verse = currentLesson.yorubaVerses[lineIdx];
    audioEngine.playToneChant(verse.tone, verse.audioPitchHz, vocalVoice);
    setTimeout(() => {
      setActiveLineIdx(null);
      setActivePlayingMode(null);
    }, 550);
  };

  const reciteVerseAloud = (lineIdx: number) => {
    setActiveLineIdx(lineIdx);
    setActivePlayingMode("recite");
    const verse = currentLesson.yorubaVerses[lineIdx];
    audioEngine.recitePanegyricVerse(
      verse.line,
      vocalVoice,
      [verse.tone],
      () => {
        setActiveLineIdx(null);
        setActivePlayingMode(null);
      }
    );
  };

  const chantFullLesson = async () => {
    if (isPracticingAll) {
      audioEngine.stopVocalRecitation();
      setIsPracticingAll(false);
      setActiveLineIdx(null);
      setActiveSyllableIdx(null);
      return;
    }

    setIsPracticingAll(true);
    audioEngine.playSaworoChime();

    for (let i = 0; i < currentLesson.yorubaVerses.length; i++) {
      if (!isPracticingAll && i > 0) break;
      setActiveLineIdx(i);
      const verse = currentLesson.yorubaVerses[i];
      
      await audioEngine.chantPureYorubaVerse(
        verse.line,
        vocalVoice,
        (sylIdx) => setActiveSyllableIdx(sylIdx)
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setActiveLineIdx(null);
    setActiveSyllableIdx(null);
    setIsPracticingAll(false);
    audioEngine.playEboBlessing();
  };

  const playSingleToneKey = (tone: YorubaTone) => {
    audioEngine.playPureYorubaTone(tone, vocalVoice, 0.6);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Academy Banner */}
      <div className="bg-zinc-900/90 border border-amber-900/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 via-amber-700 to-zinc-950 flex items-center justify-center text-3xl shadow-lg border border-purple-400/40 shrink-0">
            🪘
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-serif text-amber-200">
                Oríkì Panegyric Academy
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Pure Yoruba Tonal System (Àmì Ohùn)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Master the sacred art of Yoruba praise poetry using authentic <strong>Pure Yoruba Tones (DÒ - RE - MÍ)</strong>. Listen to authentic <strong>Male Babalawo</strong> and <strong>Female Ìyánífá</strong> vocal models, tonal cadences, and learn how to invoke panegyrics in daily life.
            </p>
          </div>
        </div>

        {/* Vocal Control & Playback */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={chantFullLesson}
            className={`px-5 py-2.5 rounded-2xl font-bold font-serif text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              isPracticingAll
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 animate-pulse"
                : "bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-purple-900/40 hover:from-purple-500 hover:to-amber-500"
            }`}
          >
            {isPracticingAll ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPracticingAll ? "Halt Recitation" : "Chant Full Panegyric"}</span>
          </button>
        </div>
      </div>

      {/* VOCAL TIMBRE & PURE YORUBA TONE TUNER BAR */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Vocal Timbre Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-serif text-amber-300">
            <Mic className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Voice:</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Male Babalawo Voice */}
            <button
              onClick={() => handleVoiceChange("male")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                vocalVoice === "male"
                  ? "bg-amber-950/80 border-amber-400 text-amber-200 shadow-md shadow-amber-900/40"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>👨 Babalawo</span>
            </button>

            {/* Female Ìyánífá Voice */}
            <button
              onClick={() => handleVoiceChange("female")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                vocalVoice === "female"
                  ? "bg-purple-950/80 border-purple-400 text-purple-200 shadow-md shadow-purple-900/40"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>👩 Ìyánífá</span>
            </button>

            {/* Sacred Duet */}
            <button
              onClick={() => handleVoiceChange("duet")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                vocalVoice === "duet"
                  ? "bg-gradient-to-r from-purple-950 to-amber-950 border-amber-400 text-white shadow-md"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>🕊️ Duet</span>
            </button>
          </div>
        </div>

        {/* Right: Pure Yoruba Tonal Tuning Keys (DÒ - RE - MÍ) */}
        <div className="flex items-center gap-2 bg-zinc-950 border border-amber-900/40 p-1.5 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-400 px-1 font-bold">
            Àmì Ohùn Keys:
          </span>

          {/* DÒ Key */}
          <button
            onClick={() => playSingleToneKey("DÒ")}
            className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/40 hover:bg-red-900/80 text-red-300 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            title="DÒ: Grave Low Tone (\) - C3 (130.8Hz) / C4 (261.6Hz)"
          >
            <span>DÒ (\)</span>
          </button>

          {/* RE Key */}
          <button
            onClick={() => playSingleToneKey("RE")}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/80 text-amber-300 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            title="RE: Unmarked Mid Tone (-) - E3 (164.8Hz) / E4 (329.6Hz)"
          >
            <span>RE (-)</span>
          </button>

          {/* MÍ Key */}
          <button
            onClick={() => playSingleToneKey("MÍ")}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/80 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            title="MÍ: Acute High Tone (/) - A3 (220Hz) / A4 (440Hz)"
          >
            <span>MÍ (/)</span>
          </button>
        </div>
      </div>

      {/* Lesson Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ORIKI_LESSONS.map((lesson) => {
          const isSelected = selectedLessonId === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                audioEngine.playIrokeTap();
                setSelectedLessonId(lesson.id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-900/40 scale-102"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-amber-600/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-950 text-amber-300 border border-zinc-800">
                  {lesson.deityOrConcept}
                </span>
                {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <h3 className="font-serif font-bold text-sm text-amber-100">{lesson.title}</h3>
              <p className="text-[11px] text-zinc-400 line-clamp-2">{lesson.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Yoruba Verses & Dual Vocal Player */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-amber-900/50 rounded-3xl p-6 flex flex-col gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                Interactive Chanting Codex & Àmì Ohùn
              </span>
              <h3 className="text-xl font-bold font-serif text-amber-200">
                {currentLesson.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                Voice: {vocalVoice === "male" ? "👨 Male Babalawo" : vocalVoice === "female" ? "👩 Female Ìyánífá" : "🕊️ Sacred Duet"}
              </span>
            </div>
          </div>

          {/* Stanzas List with Syllable Tone Breakdown */}
          <div className="flex flex-col gap-3">
            {currentLesson.yorubaVerses.map((verse, idx) => {
              const isActive = activeLineIdx === idx;
              const syllables = audioEngine.parseYorubaTextToSyllablesAndTones(verse.line);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                    isActive
                      ? vocalVoice === "female"
                        ? "bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-900/50 scale-101"
                        : "bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-900/50 scale-101"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-amber-600/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mt-0.5 ${
                          verse.tone === "HIGH"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : verse.tone === "MID"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {verse.tone} Tone
                      </span>

                      <div className="flex flex-col">
                        <span className="font-serif italic text-base text-amber-100">
                          "{verse.line}"
                        </span>
                        <span className="text-xs text-zinc-400 mt-1 font-sans">
                          {verse.translation}
                        </span>
                      </div>
                    </div>

                    {/* Audio Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                      {/* Pure Yoruba Tonal Syllabic Chant */}
                      <button
                        onClick={() => playPureYorubaTonalChant(idx)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                          isActive && activePlayingMode === "pure_chant"
                            ? "bg-amber-400 text-zinc-950 border-white shadow-md shadow-amber-900/50 animate-pulse font-bold"
                            : "bg-zinc-900 border-zinc-700 text-amber-300 hover:text-amber-200 hover:border-amber-500/40"
                        }`}
                        title="Chant with Pure Yoruba DÒ-RE-MÍ tones & portamento glides"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pure Chant</span>
                      </button>

                      {/* Speak Verse Aloud with speech synthesis */}
                      <button
                        onClick={() => reciteVerseAloud(idx)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                          isActive && activePlayingMode === "recite"
                            ? "bg-purple-500 text-white border-purple-300 shadow-md shadow-purple-900/50"
                            : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-purple-300 hover:border-purple-500/40"
                        }`}
                        title="Recite Yoruba verse with vocal speech and drone"
                      >
                        <Mic className="w-3.5 h-3.5 text-purple-400" />
                        <span>Recite</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Syllable & Tone Inspector */}
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 mr-1">
                      Àmì Ohùn:
                    </span>
                    {syllables.map((syl, sIdx) => {
                      const isSyllableActive = isActive && activeSyllableIdx === sIdx;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => audioEngine.playPureYorubaTone(syl.tone, vocalVoice, 0.5)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 border cursor-pointer ${
                            isSyllableActive
                              ? "bg-amber-300 text-zinc-950 border-white scale-110 shadow-md"
                              : syl.tone === "DÒ"
                              ? "bg-red-950/40 text-red-300 border-red-900/40 hover:bg-red-900/60"
                              : syl.tone === "MÍ"
                              ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/40 hover:bg-emerald-900/60"
                              : "bg-amber-950/40 text-amber-300 border-amber-900/40 hover:bg-amber-900/60"
                          }`}
                          title={`Syllable: "${syl.syllable}" | Tone: ${syl.tone} (${syl.accentMark}) | Pitch: ${syl.pitchHz[vocalVoice === "female" ? "female" : "male"]}Hz`}
                        >
                          <span>{syl.syllable}</span>
                          <span className="text-[8px] opacity-75 font-bold">
                            {syl.tone}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructions note */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-serif italic border-t border-zinc-800/80 pt-3">
            <span>Tap <strong>Pure Chant</strong> for authentic Yoruba tone portamento or tap individual syllable badges to hear their exact pitch.</span>
            <span className="font-mono text-amber-400/80">{vocalVoice.toUpperCase()} VOCAL ACTIVE</span>
          </div>
        </div>

        {/* Right: Cultural Philosophy & Vocal Acoustic Mechanics */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Pure Yoruba Tonal System Theory Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400">
              <Music className="w-4 h-4" />
              <span className="text-xs font-mono uppercase font-bold">
                The Pure Yoruba 3-Tone System (Àmì Ohùn Yorùbá)
              </span>
            </div>
            
            <div className="flex flex-col gap-2 text-xs text-zinc-300 font-sans leading-relaxed">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-red-900/40">
                <div className="flex items-center justify-between">
                  <strong className="text-red-300 font-serif">1. DÒ (Grave Accent `\`)</strong>
                  <span className="text-[10px] font-mono text-zinc-500">Low: 130.8Hz / 261.6Hz</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Earthly, grave, foundational anchor. Invokes ancestral depth and grounding of consciousness.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-amber-900/40">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-300 font-serif">2. RE (Unmarked `-`)</strong>
                  <span className="text-[10px] font-mono text-zinc-500">Mid: 164.8Hz / 329.6Hz</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Equilibrium, steady breath, conversational balance. Bridges physical and spiritual realms.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-emerald-900/40">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-300 font-serif">3. MÍ (Acute Accent `/`)</strong>
                  <span className="text-[10px] font-mono text-zinc-500">High: 220Hz / 440Hz</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Celestial elevation, praise call, radiant awakening. Touches the divine apex of Orí.
                </p>
              </div>
            </div>
          </div>

          {/* Philosophical Meaning */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-mono uppercase font-bold">
                Cosmological & Cultural Wisdom
              </span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed font-sans">
              {currentLesson.culturalLesson}
            </p>
          </div>

          {/* Real-Life Modern Application */}
          <div className="bg-gradient-to-br from-amber-950/40 to-zinc-950 border border-amber-500/40 rounded-3xl p-6 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-serif font-bold">
                How to Apply This Panegyric in Real Life:
              </span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
              {currentLesson.realLifeApplication}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
