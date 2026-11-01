import React, { useState, useEffect } from "react";
import { DailyOriAlignment, DivinerRank, VocalMode } from "../../types";
import { getDailyOriForRank, getYorubaDayName, DAILY_ORI_ALIGNMENTS } from "../../data/dailyOriData";
import { audioEngine } from "../../services/audioEngine";
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Sun,
  Wind,
  Shield,
  X,
  BookOpen,
  ChevronRight,
  Award,
  Mic
} from "lucide-react";

interface DailyOriModalProps {
  isOpen: boolean;
  onClose: () => void;
  divinerRank: DivinerRank;
  onClaimAse: (points: number) => void;
  wisdomAse: number;
}

export const DailyOriModal: React.FC<DailyOriModalProps> = ({
  isOpen,
  onClose,
  divinerRank,
  onClaimAse,
  wisdomAse,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"prayer" | "affirmation" | "breathwork">("prayer");
  const [copied, setCopied] = useState<boolean>(false);
  const [isChanting, setIsChanting] = useState<boolean>(false);
  const [isPureChanting, setIsPureChanting] = useState<boolean>(false);
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number | null>(null);
  const [isReciting, setIsReciting] = useState<boolean>(false);
  const [vocalVoice, setVocalVoice] = useState<VocalMode>("male");
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathSeconds, setBreathSeconds] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [viewingRank, setViewingRank] = useState<DivinerRank>(divinerRank);

  // Daily state
  const todayKey = new Date().toISOString().slice(0, 10);
  const [isClaimedToday, setIsClaimedToday] = useState<boolean>(() => {
    return localStorage.getItem(`ifa_ori_claimed_${todayKey}`) === "true";
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("ifa_ori_streak");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    setViewingRank(divinerRank);
  }, [divinerRank]);

  // Daily Alignment Data
  const dailyData: DailyOriAlignment = getDailyOriForRank(viewingRank, todayKey);
  const yorubaDay = getYorubaDayName(new Date());

  // Breathwork timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive && isOpen && activeSubTab === "breathwork") {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            if (breathPhase === "inhale") {
              setBreathPhase("hold");
              audioEngine.playToneChant("MID", 330);
              return 4;
            } else if (breathPhase === "hold") {
              setBreathPhase("exhale");
              audioEngine.playToneChant("LOW", 220);
              return 4;
            } else {
              setBreathPhase("inhale");
              audioEngine.playToneChant("HIGH", 440);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, isOpen, activeSubTab]);

  if (!isOpen) return null;

  const handleCopyPrayer = () => {
    const textToCopy = `[Daily Orí Alignment - ${dailyData.title}]\n\n${dailyData.yorubaPrayer}\n\nTranslation: ${dailyData.englishTranslation}\n\nAffirmation: "${dailyData.morningAffirmation}"\n- Òpó Ifá Sacred Oracle`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePureYorubaChant = () => {
    if (isPureChanting) {
      audioEngine.stopVocalRecitation();
      setIsPureChanting(false);
      setActiveSyllableIdx(null);
      return;
    }

    setIsPureChanting(true);
    audioEngine.chantPureYorubaVerse(
      dailyData.yorubaPrayer,
      vocalVoice,
      (idx) => setActiveSyllableIdx(idx),
      () => {
        setIsPureChanting(false);
        setActiveSyllableIdx(null);
      }
    );
  };

  const handlePlayChant = () => {
    setIsChanting(true);
    audioEngine.playSaworoChime();

    dailyData.chantTones.forEach((tone, idx) => {
      setTimeout(() => {
        audioEngine.playToneChant(tone, undefined, vocalVoice);
      }, (idx + 1) * 450);
    });

    setTimeout(() => {
      setIsChanting(false);
    }, (dailyData.chantTones.length + 1) * 450);
  };

  const handleRecitePrayer = () => {
    if (isReciting) {
      audioEngine.stopVocalRecitation();
      setIsReciting(false);
      return;
    }
    setIsReciting(true);
    audioEngine.recitePanegyricVerse(
      dailyData.yorubaPrayer,
      vocalVoice,
      dailyData.chantTones,
      () => setIsReciting(false)
    );
  };

  const handleClaim = () => {
    if (isClaimedToday) return;

    audioEngine.playSaworoChime();
    setTimeout(() => {
      audioEngine.playEboBlessing();
    }, 200);

    const newStreak = streak + 1;
    setStreak(newStreak);
    setIsClaimedToday(true);
    localStorage.setItem(`ifa_ori_claimed_${todayKey}`, "true");
    localStorage.setItem("ifa_ori_streak", newStreak.toString());

    onClaimAse(10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-amber-800/60 rounded-3xl shadow-2xl shadow-amber-950/60 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Sacred Decorative Header */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-b border-amber-900/50 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-inner shadow-amber-950">
              🌅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  {yorubaDay.yorubaName}
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">• {yorubaDay.meaning}</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-amber-100 flex items-center gap-2">
                Daily Orí Alignment
                <span className="text-xs text-amber-400/80 font-normal font-sans">(Àdúrà Òwúrọ̀)</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rank Badge & Streak Indicator */}
        <div className="px-6 py-2.5 bg-zinc-900/90 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Diviner Rank:</span>
            <span className="font-serif font-bold text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-700/40">
              👑 {viewingRank}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{streak} Day Alignment Streak</span>
            </div>

            {isClaimedToday ? (
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Àṣẹ Consecrated</span>
              </span>
            ) : (
              <span className="text-amber-400/90 font-mono animate-pulse">
                +10 Àṣẹ Available
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/70 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveSubTab("prayer")}
            className={`pb-2.5 px-3 text-xs font-serif font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "prayer"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sacred Prayer (Àdúrà)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("affirmation")}
            className={`pb-2.5 px-3 text-xs font-serif font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "affirmation"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Daily Affirmation & Ìwà</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab("breathwork");
              setIsBreathingActive(true);
            }}
            className={`pb-2.5 px-3 text-xs font-serif font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "breathwork"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Orí Consecration Breath</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Main Title & Governing Odù Sign */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-zinc-900/60 border border-amber-900/40">
            <div>
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Governing Odù: {dailyData.governingOdu}</span>
              </div>
              <h3 className="text-lg font-bold font-serif text-amber-100">{dailyData.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{dailyData.oriFocusTheme}</p>
            </div>

            {/* Binary Odù Signature */}
            <div className="bg-zinc-950 px-3 py-2 rounded-xl border border-amber-800/40 shadow-inner flex flex-col items-center justify-center">
              <span className="text-[9px] text-amber-500/80 font-mono uppercase mb-1">Odù Sign</span>
              <div className="space-y-0.5 font-mono text-xs font-bold text-amber-300 tracking-widest text-center">
                {dailyData.oduSign.map((pair, idx) => (
                  <div key={idx} className="flex gap-2 justify-center">
                    <span>{pair[0]}</span>
                    <span>{pair[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB 1: SACRED PRAYER */}
          {activeSubTab === "prayer" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-900/40 relative shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 text-xs">
                  <span className="text-amber-400 font-serif italic">{dailyData.yorubaGreeting}</span>
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Voice Toggle */}
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 mr-1">
                      <button
                        onClick={() => {
                          setVocalVoice("male");
                          audioEngine.playMaleVocal(140, 0.3);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-serif cursor-pointer ${
                          vocalVoice === "male"
                            ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                        title="Male Babalawo Voice"
                      >
                        👨 Male
                      </button>
                      <button
                        onClick={() => {
                          setVocalVoice("female");
                          audioEngine.playFemaleVocal(300, 0.3);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-serif cursor-pointer ${
                          vocalVoice === "female"
                            ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                        title="Female Ìyánífá Voice"
                      >
                        👩 Female
                      </button>
                    </div>

                    <button
                      onClick={handleCopyPrayer}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                      title="Copy Prayer to Clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      onClick={handlePureYorubaChant}
                      className={`px-2.5 py-1.5 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isPureChanting
                          ? "bg-amber-400 text-zinc-950 border-white animate-pulse font-bold"
                          : "bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30 text-amber-300"
                      }`}
                      title="Chant with Pure Yoruba DÒ-RE-MÍ tones"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPureChanting ? "animate-bounce" : ""}`} />
                      <span>{isPureChanting ? "Chanting..." : "Pure Chant"}</span>
                    </button>

                    <button
                      onClick={handleRecitePrayer}
                      className={`px-2.5 py-1.5 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isReciting
                          ? "bg-purple-600 text-white border-purple-400 animate-pulse"
                          : "bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30 text-purple-300"
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isReciting ? "Reciting..." : "Recite Aloud"}</span>
                    </button>
                  </div>
                </div>

                {/* Yoruba Prayer Lines */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-amber-200 font-serif text-sm md:text-base leading-relaxed tracking-wide">
                  "{dailyData.yorubaPrayer}"
                </div>

                {/* Interactive Pure Yoruba Syllable Inspector */}
                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 mr-1">
                    Àmì Ohùn (Pure Tones):
                  </span>
                  {audioEngine.parseYorubaTextToSyllablesAndTones(dailyData.yorubaPrayer).map((syl, sIdx) => {
                    const isSyllableActive = isPureChanting && activeSyllableIdx === sIdx;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => audioEngine.playPureYorubaTone(syl.tone, vocalVoice, 0.45)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all flex items-center gap-1 border cursor-pointer ${
                          isSyllableActive
                            ? "bg-amber-300 text-zinc-950 border-white scale-110 shadow-md font-bold"
                            : syl.tone === "DÒ"
                            ? "bg-red-950/40 text-red-300 border-red-900/40 hover:bg-red-900/60"
                            : syl.tone === "MÍ"
                            ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/40 hover:bg-emerald-900/60"
                            : "bg-amber-950/40 text-amber-300 border-amber-900/40 hover:bg-amber-900/60"
                        }`}
                        title={`Syllable: ${syl.syllable} | Tone: ${syl.tone} (${syl.accentMark})`}
                      >
                        <span>{syl.syllable}</span>
                        <span className="text-[8px] opacity-75 font-bold">{syl.tone}</span>
                      </button>
                    );
                  })}
                </div>

                {/* English Translation */}
                <div className="mt-3 text-xs md:text-sm text-zinc-300 leading-relaxed font-sans italic">
                  <span className="text-amber-400/90 font-serif not-italic font-bold block mb-1">Translation:</span>
                  "{dailyData.englishTranslation}"
                </div>

                {/* Tone Notes */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-[11px]">
                  <span className="text-zinc-500 font-mono">Tonal Chants:</span>
                  <div className="flex gap-1">
                    {dailyData.chantTones.map((t, idx) => (
                      <span
                        key={idx}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                          t === "HIGH"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : t === "MID"
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                            : "bg-stone-500/20 text-stone-300 border border-stone-500/40"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AFFIRMATION & ÌWÀ PÈLÉ */}
          {activeSubTab === "affirmation" && (
            <div className="space-y-4">
              {/* Daily Affirmation Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/30 via-zinc-900/90 to-orange-950/30 border border-amber-700/50 shadow-md">
                <span className="text-[11px] font-mono uppercase text-amber-400 flex items-center gap-1.5 mb-2">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Morning Orí Affirmation</span>
                </span>
                <blockquote className="text-base md:text-lg font-serif italic text-amber-100 leading-relaxed font-semibold">
                  "{dailyData.morningAffirmation}"
                </blockquote>
              </div>

              {/* Philosophical Reflection */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                <span className="font-serif font-bold text-amber-300 text-xs block">
                  Ọ̀rúnmìlà’s Inward Wisdom (Ẹ̀kọ́ Ifá):
                </span>
                <p className="leading-relaxed">{dailyData.philosophicalReflection}</p>
              </div>

              {/* Ìwà Pẹ̀lẹ́ Daily Discipline */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-zinc-300 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-serif font-bold">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daily Micro-Discipline of Character (Ìwà Pẹ̀lẹ́):</span>
                </div>
                <p className="leading-relaxed text-amber-100/90">{dailyData.dailyCharacterDiscipline}</p>
              </div>
            </div>
          )}

          {/* TAB 3: BREATHWORK CONSECRATION */}
          {activeSubTab === "breathwork" && (
            <div className="space-y-4 flex flex-col items-center text-center">
              <p className="text-xs text-zinc-400 max-w-md">
                Ground your spirit before entering the shrine. Align your physical breath with your inner destiny (Orí Inú).
              </p>

              {/* Animated Sacred Breathing Orb */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div
                  className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-1000 shadow-2xl relative ${
                    breathPhase === "inhale"
                      ? "scale-110 border-amber-400 bg-amber-500/20 shadow-amber-500/50"
                      : breathPhase === "hold"
                      ? "scale-105 border-orange-400 bg-orange-500/30 shadow-orange-500/50 ring-4 ring-orange-500/20"
                      : "scale-90 border-amber-700 bg-amber-950/40 shadow-amber-950/40"
                  }`}
                >
                  <span className="text-xs uppercase font-mono tracking-widest text-amber-300 font-bold mb-1">
                    {breathPhase === "inhale" && "Inhale Àṣẹ"}
                    {breathPhase === "hold" && "Hold in Stillness"}
                    {breathPhase === "exhale" && "Exhale Distraction"}
                  </span>
                  <span className="text-4xl font-mono font-bold text-amber-100">{breathSeconds}s</span>
                  <span className="text-[10px] text-zinc-400 font-serif mt-1">Orí Inú</span>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Inhale Vitality</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span>Anchor Destiny</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-800" />
                  <span>Release Fear</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank Preview Switcher for Curious Initiates */}
          <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-zinc-500 font-serif">Explore Alignment by Rank:</span>
            <div className="flex flex-wrap gap-1">
              {(["Akẹ́kọ̀ọ́ (Initiate)", "Awoyẹ (Apprentice Diviner)", "Babalawo (Master of Mysteries)", "Olúwo (Grand High Priest)"] as DivinerRank[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setViewingRank(r)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-serif transition-colors cursor-pointer ${
                    viewingRank === r
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {r.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:p-5 bg-zinc-950 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Daily morning communion anchors your consultations.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-serif transition-colors cursor-pointer border border-zinc-800"
            >
              Continue to Chamber
            </button>

            <button
              onClick={handleClaim}
              disabled={isClaimedToday}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl font-serif text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer ${
                isClaimedToday
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 cursor-default"
                  : "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-zinc-950 hover:brightness-110 shadow-amber-900/40 border border-amber-400"
              }`}
            >
              {isClaimedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Consecrated Today (+10 Àṣẹ)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>Claim Daily Àṣẹ (+10 Wisdom)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
