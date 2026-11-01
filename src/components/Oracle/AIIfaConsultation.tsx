import React, { useState } from "react";
import { DivinerRank } from "../../types";
import { audioEngine } from "../../services/audioEngine";
import { Sparkles, Send, BookOpen, Volume2, Award, Heart, Shield, RefreshCw, Feather } from "lucide-react";

interface AIIfaConsultationProps {
  divinerRank: DivinerRank;
  onAwardWisdom: (points: number) => void;
}

export const AIIfaConsultation: React.FC<AIIfaConsultationProps> = ({
  divinerRank,
  onAwardWisdom,
}) => {
  const [userDilemma, setUserDilemma] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Career & Purpose");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consultationResult, setConsultationResult] = useState<any | null>(null);

  const sampleDilemmas = [
    {
      category: "Career & Purpose",
      text: "I was offered a high-paying executive job at a defense contractor, but my heart longs to build a non-profit clean water initiative for rural villages. My family thinks I am being foolish.",
    },
    {
      category: "Ethics & Justice",
      text: "I discovered that my mentor and business partner has been cutting corners on safety inspections to meet a crucial launch deadline. How do I address this without ruining our friendship?",
    },
    {
      category: "Family & Lineage",
      text: "My siblings and I cannot agree on how to care for our aging mother. Resentment from childhood grievances is boiling over and paralyzing our family.",
    },
    {
      category: "Health & Wellbeing",
      text: "I work 80 hours a week building a tech startup and I am experiencing severe burnout, insomnia, and panic attacks, but I feel guilty whenever I take a single hour of rest.",
    },
  ];

  const handleSelectSample = (sample: { category: string; text: string }) => {
    audioEngine.playIrokeTap();
    setSelectedCategory(sample.category);
    setUserDilemma(sample.text);
  };

  const handleConsultOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDilemma.trim() || isLoading) return;

    setIsLoading(true);
    setConsultationResult(null);
    audioEngine.playOpeleCast();

    try {
      const res = await fetch("/api/ifa/divine-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userDilemma,
          seekerCategory: selectedCategory,
          divinerRank,
        }),
      });

      const data = await res.json();
      if (data && data.divination) {
        setConsultationResult(data.divination);
        audioEngine.playEboBlessing();
        onAwardWisdom(30);
      }
    } catch (err) {
      console.error("Consultation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Banner */}
      <div className="bg-zinc-900/90 border border-amber-900/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-950 flex items-center justify-center text-3xl shadow-lg border border-amber-400/40 shrink-0">
            🐚
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-amber-200">
              AI Ọ̀rúnmìlà Consultation Shrine
            </h2>
            <p className="text-xs text-zinc-400">
              Present any real-life personal dilemma, ethical fork in the road, or mental burnout crisis. Gemini 3.7 Flash casts sacred Ifá wisdom, revealing mythological precedent and custom Oríkì panegyrics.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          Powered by Gemini 3.7 Flash
        </span>
      </div>

      {/* Input Stage */}
      <div className="bg-zinc-900/90 border border-amber-900/50 rounded-3xl p-6 flex flex-col gap-5 shadow-xl backdrop-blur-md">
        <form onSubmit={handleConsultOracle} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-2 block">
              Choose Dilemma Realm:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Career & Purpose",
                "Ethics & Justice",
                "Family & Lineage",
                "Health & Wellbeing",
                "Love & Trust",
                "Communal Leadership",
              ].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                      : "bg-zinc-950/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-2 block">
              Speak Your Dilemma to the Ọpọ́n Ifá:
            </label>
            <textarea
              value={userDilemma}
              onChange={(e) => setUserDilemma(e.target.value)}
              placeholder="Describe your current struggle, moral dilemma, decision you are wrestling with, or feeling of stagnation..."
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 font-sans transition-colors resize-none"
            />
          </div>

          {/* Quick Dilemma Starters */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-500">
              Or pick a sample real-life scenario:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleDilemmas.map((sample, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-850 hover:border-amber-500/40 text-left text-[11px] text-zinc-300 font-sans transition-all line-clamp-2 cursor-pointer"
                >
                  <strong className="text-amber-400 block">{sample.category}:</strong>
                  {sample.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !userDilemma.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold font-serif text-sm shadow-xl shadow-amber-900/40 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consulting Sacred Ọ̀pẹ̀lẹ̀ Chain...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Divinate & Receive Panegyric Counsel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Consultation Result Display */}
      {consultationResult && (
        <div className="bg-zinc-900/90 border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl animate-fade-in backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                Divine Verdict of Ọ̀rúnmìlà
              </span>
              <h3 className="text-2xl font-bold font-serif text-amber-200">
                Revealed Odù: {consultationResult.revealedOdu}
              </h3>
              <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
                "{consultationResult.essence}"
              </p>
            </div>

            <button
              onClick={() => audioEngine.playToneChant("HIGH")}
              className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300 hover:text-amber-200 text-xs font-serif flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Chant Oríkì Tone</span>
            </button>
          </div>

          {/* Yoruba Proverb */}
          {consultationResult.proverb && (
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-serif uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sacred Proverb (Òwe Ifá)</span>
              </span>
              <p className="text-sm font-serif italic text-amber-100 mt-1">
                "{consultationResult.proverb.yoruba}"
              </p>
              <p className="text-xs text-zinc-300 mt-1 font-sans">
                <strong>Translation:</strong> {consultationResult.proverb.translation}
              </p>
            </div>
          )}

          {/* Mythological Verse */}
          {consultationResult.eseIfaVerse && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                Mythological Precedent & Historical Diviners
              </span>
              <p className="text-xs text-amber-300 font-serif">
                Diviner: <strong>{consultationResult.eseIfaVerse.ancientDiviners}</strong>
              </p>
              <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                {consultationResult.eseIfaVerse.translation || consultationResult.eseIfaVerse.verse}
              </p>
            </div>
          )}

          {/* Custom Oríkì Panegyric for User */}
          <div className="bg-purple-950/40 border border-purple-800/50 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">
              Custom Oríkì Panegyric for Your Inner Orí:
            </span>
            <p className="text-base font-serif italic text-purple-100 leading-relaxed">
              "{consultationResult.customOrikiPanegyric}"
            </p>
            <p className="text-xs text-zinc-300 font-sans">
              <strong>English:</strong> {consultationResult.orikiTranslation}
            </p>
          </div>

          {/* Prescribed Action & Philosophical Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950/80 border border-amber-600/30 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                Prescribed Character Action (Ebọ Ìwà):
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {consultationResult.prescribedEboAction}
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-emerald-600/30 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                Philosophical Guidance for Modern Life:
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {consultationResult.philosophicalGuidance}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
