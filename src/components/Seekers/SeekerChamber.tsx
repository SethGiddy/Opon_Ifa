import React, { useState } from "react";
import { SeekerDilemma, OduIfa, DivinerRank, VocalMode } from "../../types";
import { SEEKER_CASES, THE_16_MEYI_ODU } from "../../data/ifaData";
import { audioEngine } from "../../services/audioEngine";
import { Sparkles, ArrowRight, BookOpen, CheckCircle2, Shield, HeartHandshake, Volume2, Award, RotateCcw, Feather, Mic } from "lucide-react";
import { DailyOriWidget } from "../DailyOri/DailyOriWidget";

interface SeekerChamberProps {
  divinerRank: DivinerRank;
  onCompleteCase: (growth: number) => void;
  onOpenDailyOriModal?: () => void;
}

export const SeekerChamber: React.FC<SeekerChamberProps> = ({
  divinerRank,
  onCompleteCase,
  onOpenDailyOriModal,
}) => {
  const [selectedSeekerId, setSelectedSeekerId] = useState<string>("seeker_tech_ethicist");
  const [vocalVoice, setVocalVoice] = useState<VocalMode>("male");
  const [recitingStanzaIdx, setRecitingStanzaIdx] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "testimony" | "divination" | "oriki_chant" | "counsel" | "resolution"
  >("testimony");

  const [selectedStanzas, setSelectedStanzas] = useState<number[]>([]);
  const [selectedCounselId, setSelectedCounselId] = useState<string | null>(null);
  const [isCastingOpele, setIsCastingOpele] = useState<boolean>(false);
  const [activeTones, setActiveTones] = useState<number | null>(null);

  const seeker = SEEKER_CASES.find((s) => s.id === selectedSeekerId) || SEEKER_CASES[0];
  const associatedOdu = THE_16_MEYI_ODU.find((o) => o.id === seeker.associatedOduId) || THE_16_MEYI_ODU[0];

  const handleStartDivination = () => {
    audioEngine.playIrokeTap();
    setCurrentStep("divination");
  };

  const handleCastOpele = () => {
    setIsCastingOpele(true);
    audioEngine.playOpeleCast();
    setTimeout(() => {
      setIsCastingOpele(false);
      audioEngine.playSaworoChime();
    }, 600);
  };

  const handleProceedToOriki = () => {
    audioEngine.playToneChant("HIGH");
    setCurrentStep("oriki_chant");
    setSelectedStanzas([]);
  };

  const toggleStanzaOrder = (index: number) => {
    audioEngine.playToneChant(index % 2 === 0 ? "HIGH" : "MID");
    if (selectedStanzas.includes(index)) {
      setSelectedStanzas(selectedStanzas.filter((i) => i !== index));
    } else {
      setSelectedStanzas([...selectedStanzas, index]);
    }
  };

  const isOrikiCorrect =
    selectedStanzas.length === seeker.panegyricRequirement.stanzas.length &&
    selectedStanzas.every((val, idx) => val === seeker.panegyricRequirement.correctOrder[idx]);

  const handleProceedToCounsel = () => {
    audioEngine.playSaworoChime();
    setCurrentStep("counsel");
  };

  const handleSelectCounsel = (counselId: string) => {
    setSelectedCounselId(counselId);
    audioEngine.playIrokeTap();
  };

  const handleFinalizeResolution = () => {
    const chosen = seeker.counselChoices.find((c) => c.id === selectedCounselId);
    if (chosen) {
      if (chosen.isOptimal) {
        audioEngine.playEboBlessing();
        onCompleteCase(chosen.spiritualGrowth);
      } else {
        audioEngine.playTalkingDrum("LOW");
        onCompleteCase(Math.max(5, chosen.spiritualGrowth));
      }
      setCurrentStep("resolution");
    }
  };

  const handleNextSeeker = (nextId: string) => {
    audioEngine.playIrokeTap();
    setSelectedSeekerId(nextId);
    setCurrentStep("testimony");
    setSelectedStanzas([]);
    setSelectedCounselId(null);
  };

  const chosenCounsel = seeker.counselChoices.find((c) => c.id === selectedCounselId);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Daily Orí Morning Alignment Banner Widget */}
      {onOpenDailyOriModal && (
        <DailyOriWidget
          divinerRank={divinerRank}
          onOpenModal={onOpenDailyOriModal}
        />
      )}

      {/* Seeker Navigation Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SEEKER_CASES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleNextSeeker(s.id)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-serif flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              selectedSeekerId === s.id
                ? "bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-900/50 scale-102"
                : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
          >
            <span className="text-base">{s.avatar}</span>
            <span className="font-bold">{s.name}</span>
            <span className="text-[10px] text-zinc-300 font-mono hidden md:inline">({s.category})</span>
          </button>
        ))}
      </div>

      {/* Main Seeker Consultation Stage */}
      <div className="bg-zinc-900/90 border border-amber-900/50 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
        {/* Step Indicator Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border-2 border-amber-500/60 flex items-center justify-center text-3xl shadow-lg">
              {seeker.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-amber-200">{seeker.name}</h2>
                <span className="text-xs text-amber-400/80 font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  {seeker.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 italic font-serif">{seeker.title} • {seeker.context}</p>
            </div>
          </div>

          {/* Flow Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === "testimony" ? "bg-amber-500 text-zinc-950 font-bold" : "bg-zinc-950 text-zinc-400"}`}>
              1. Testimony
            </span>
            <span>→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === "divination" ? "bg-amber-500 text-zinc-950 font-bold" : "bg-zinc-950 text-zinc-400"}`}>
              2. Ọ̀pẹ̀lẹ̀ Cast
            </span>
            <span>→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === "oriki_chant" ? "bg-amber-500 text-zinc-950 font-bold" : "bg-zinc-950 text-zinc-400"}`}>
              3. Oríkì Chant
            </span>
            <span>→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === "counsel" ? "bg-amber-500 text-zinc-950 font-bold" : "bg-zinc-950 text-zinc-400"}`}>
              4. Ebọ Ìwà
            </span>
          </div>
        </div>

        {/* STEP 1: SEEKER TESTIMONY & REAL-LIFE CRISIS */}
        {currentStep === "testimony" && (
          <div className="flex flex-col gap-5">
            <div className="bg-zinc-950/80 border border-amber-700/40 rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                The Seeker's Testimony:
              </span>
              <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-sans">
                "{seeker.backgroundNarrative}"
              </p>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs font-serif font-bold text-amber-300">The Core Ethical Dilemma:</span>
              <p className="text-sm font-serif italic text-amber-100">
                "{seeker.dilemmaSummary}"
              </p>
              <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                Emotional State: <strong className="text-orange-300">{seeker.emotionalState}</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleStartDivination}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold font-serif text-sm shadow-xl shadow-amber-900/40 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Lay Hands on Ọpọ́n & Cast Divination</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SACRED DIVINATION (ỌPỌ́N & Ọ̀PẸ̀LẸ̀ REVEAL) */}
        {currentStep === "divination" && (
          <div className="flex flex-col gap-5">
            <div className="text-center flex flex-col items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Consulting Ọ̀rúnmìlà for {seeker.name}
              </h3>
              <p className="text-xs text-zinc-400 max-w-lg">
                Cast the sacred Ọ̀pẹ̀lẹ̀ divining chain to let the cosmic forces reveal the governing Odù and mythological precedent.
              </p>
            </div>

            {/* Divination Visual Display */}
            <div className="bg-zinc-950/90 border border-amber-600/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
              {/* Animated 8-Seed Pattern */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  Revealed Ọ̀pẹ̀lẹ̀ Signature
                </span>
                <div className="flex flex-col gap-2 bg-amber-950/40 p-4 rounded-2xl border border-amber-500/40">
                  {associatedOdu.pattern.map((row, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-6">
                      <span className="w-10 h-7 rounded bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center">
                        {row[0] === "I" ? "I" : "I I"}
                      </span>
                      <span className="w-10 h-7 rounded bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center">
                        {row[1] === "I" ? "I" : "I I"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revealed Odù Meta */}
              <div className="flex flex-col gap-2 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Governing Odù: {associatedOdu.name}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">({associatedOdu.element})</span>
                </div>
                <h4 className="text-xl font-bold font-serif text-amber-100">
                  {associatedOdu.essence}
                </h4>
                <blockquote className="text-xs font-serif italic text-amber-300/90 border-l-2 border-amber-500/50 pl-3">
                  "{associatedOdu.proverb.yoruba}"
                </blockquote>
                <p className="text-xs text-zinc-300">
                  <strong>Ancestral Diviners:</strong> {associatedOdu.eseIfaStory.ancientDiviners}
                </p>
                <p className="text-xs text-zinc-400">
                  <strong>Mythological Precedent:</strong> {associatedOdu.eseIfaStory.mythologicalDilemma}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleCastOpele}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-amber-300 text-xs font-serif flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Re-cast Ọ̀pẹ̀lẹ̀ Clatter</span>
              </button>

              <button
                onClick={handleProceedToOriki}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold font-serif text-sm shadow-xl shadow-amber-900/40 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Oríkì Panegyric Chant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORÍKÌ PANEGYRIC LEARNING & ASSEMBLY */}
        {currentStep === "oriki_chant" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪘</span>
                  <h3 className="text-lg font-serif font-bold text-amber-200">
                    {seeker.panegyricRequirement.targetOriki}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  To invoke spiritual clarity for {seeker.name}, assemble the 4 poetic stanzas in the sacred philosophical sequence.
                </p>
              </div>

              {/* Vocal Voice Selector */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0 self-start md:self-auto">
                <span className="text-[10px] font-mono text-zinc-500 mr-1.5 ml-1">Vocalist:</span>
                <button
                  onClick={() => {
                    setVocalVoice("male");
                    audioEngine.playMaleVocal(140, 0.3);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    vocalVoice === "male"
                      ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  👨 Babalawo
                </button>
                <button
                  onClick={() => {
                    setVocalVoice("female");
                    audioEngine.playFemaleVocal(300, 0.3);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    vocalVoice === "female"
                      ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  👩 Ìyánífá
                </button>
              </div>
            </div>

            {/* Clickable Stanzas */}
            <div className="grid grid-cols-1 gap-2.5">
              {seeker.panegyricRequirement.stanzas.map((stanza, idx) => {
                const orderNumber = selectedStanzas.indexOf(idx) + 1;
                const isSelected = orderNumber > 0;
                const isRecitingThis = recitingStanzaIdx === idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-amber-950/60 border-amber-400 text-white shadow-lg shadow-amber-900/30"
                        : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-amber-600/50"
                    }`}
                  >
                    <div
                      onClick={() => toggleStanzaOrder(idx)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-amber-400 text-zinc-950"
                            : "bg-zinc-900 border border-zinc-700 text-zinc-500"
                        }`}
                      >
                        {isSelected ? orderNumber : "✦"}
                      </div>
                      <span className="font-serif italic text-sm md:text-base text-amber-100">
                        "{stanza}"
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Pure Yoruba Chant Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecitingStanzaIdx(idx);
                          audioEngine.chantPureYorubaVerse(
                            stanza,
                            vocalVoice,
                            undefined,
                            () => setRecitingStanzaIdx(null)
                          );
                        }}
                        className={`px-2 py-1 rounded-lg border text-xs font-serif flex items-center gap-1 cursor-pointer transition-all ${
                          isRecitingThis
                            ? "bg-amber-400 text-zinc-950 border-white animate-pulse font-bold"
                            : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                        }`}
                        title="Chant with Pure Yoruba DÒ-RE-MÍ tones"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Pure Chant</span>
                      </button>

                      {/* Recite Aloud Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecitingStanzaIdx(idx);
                          audioEngine.recitePanegyricVerse(
                            stanza,
                            vocalVoice,
                            ["HIGH", "MID"],
                            () => setRecitingStanzaIdx(null)
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-serif flex items-center gap-1.5 cursor-pointer transition-all ${
                          isRecitingThis
                            ? "bg-purple-600 text-white border-purple-400 animate-pulse"
                            : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-purple-300 hover:border-purple-500/40"
                        }`}
                        title="Recite aloud in selected voice"
                      >
                        <Mic className="w-3 h-3 text-purple-400" />
                        <span className="text-[11px]">Recite</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alignment Feedback */}
            <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
              <div className="text-xs text-zinc-300">
                <span>Selected: </span>
                <strong className="text-amber-400">{selectedStanzas.length}</strong> /{" "}
                <span>{seeker.panegyricRequirement.stanzas.length} Stanzas</span>
              </div>

              {isOrikiCorrect ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-serif font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Panegyric Harmonized! Sacred Àṣẹ Awakened.</span>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedStanzas([0, 1, 2, 3])}
                  className="text-xs text-amber-400/80 hover:text-amber-300 font-mono underline cursor-pointer"
                >
                  Auto-Align (Initiate Guidance)
                </button>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleProceedToCounsel}
                disabled={!isOrikiCorrect}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold font-serif text-sm shadow-xl shadow-amber-900/40 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Proceed to Prescribe Counsel (Ebọ Ìwà)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRESCRIBING SACRED COUNSEL & EBỌ ÌWÀ */}
        {currentStep === "counsel" && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Prescribe Sacred Resolution for {seeker.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                In Ifá, true sacrifice (Ebọ) is not merely material offerings—it is <strong>Ebọ Ìwà</strong>: moral character transformation, reconciliation, courage, and truth.
              </p>
            </div>

            {/* Counsel Choices */}
            <div className="grid grid-cols-1 gap-3">
              {seeker.counselChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelectCounsel(choice.id)}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                    selectedCounselId === choice.id
                      ? "bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-900/40 scale-101"
                      : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-amber-600/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-amber-100">
                      {choice.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400">
                      {choice.philosophicalAlignment}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {choice.description}
                  </p>

                  <div className="text-[11px] text-amber-400/90 font-mono mt-1">
                    <strong>Prescribed Action:</strong> {choice.prescribedAction}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleFinalizeResolution}
                disabled={!selectedCounselId}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold font-serif text-sm shadow-xl shadow-amber-900/40 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Deliver Sacred Counsel</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: THE RESOLUTION & EPIPHANY TRANSFORMATION */}
        {currentStep === "resolution" && chosenCounsel && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div
              className={`p-6 rounded-3xl border-2 flex flex-col gap-4 ${
                chosenCounsel.isOptimal
                  ? "bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-amber-950/40 border-emerald-500/60"
                  : "bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-950 border-red-800/60"
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chosenCounsel.isOptimal ? "🌟" : "⚠️"}</span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-amber-200">
                      {chosenCounsel.isOptimal ? "Sacred Transformation Attained" : "Lessons in Misaligned Counsel"}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono">{chosenCounsel.philosophicalAlignment}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    chosenCounsel.isOptimal
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  +{chosenCounsel.spiritualGrowth} Àṣẹ Points
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  The Story of Transformation:
                </span>
                <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-sans">
                  {chosenCounsel.consequenceStory}
                </p>
              </div>

              {chosenCounsel.isOptimal && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="text-xs text-amber-200 font-serif">
                    <strong>Ancestral Blessing Bestowed:</strong> {seeker.name} has overcome their crisis through noble character (Ìwà Pẹ̀lẹ́). Their lineage offers you eternal gratitude.
                  </div>
                </div>
              )}
            </div>

            {/* Next Seeker Navigation */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("testimony")}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-serif flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Revisit Case</span>
              </button>

              <button
                onClick={() => {
                  const currIdx = SEEKER_CASES.findIndex((s) => s.id === selectedSeekerId);
                  const nextSeeker = SEEKER_CASES[(currIdx + 1) % SEEKER_CASES.length];
                  handleNextSeeker(nextSeeker.id);
                }}
                className="px-6 py-3 rounded-2xl bg-amber-500 text-zinc-950 font-bold font-serif text-xs hover:bg-amber-400 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Consult Next Seeker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
