import React from "react";
import { DivinerRank } from "../../types";
import { Award, Sparkles, TrendingUp, ShieldCheck, Heart, BookOpen, CheckCircle } from "lucide-react";

interface DivinerMetricsProps {
  divinerRank: DivinerRank;
  wisdomAse: number;
  maxWisdomAse: number;
  casesResolvedCount: number;
  iwaPeleAlignmentScore: number;
}

export const DivinerMetrics: React.FC<DivinerMetricsProps> = ({
  divinerRank,
  wisdomAse,
  maxWisdomAse,
  casesResolvedCount,
  iwaPeleAlignmentScore,
}) => {
  const ranks: { name: DivinerRank; title: string; desc: string; reqAse: number }[] = [
    {
      name: "Akẹ́kọ̀ọ́ (Initiate)",
      title: "The Seeker of Signs",
      desc: "Learning the binary signatures of the 16 Principal Méjì and reciting basic Oríkì Orí.",
      reqAse: 0,
    },
    {
      name: "Awoyẹ (Apprentice Diviner)",
      title: "The Apprentice of Truth",
      desc: "Decoding psychological dilemmas, casting the Ọ̀pẹ̀lẹ̀ chain, and identifying root anxieties.",
      reqAse: 40,
    },
    {
      name: "Babalawo (Master of Mysteries)",
      title: "Father of Sacred Secrets",
      desc: "Conducting multi-stage consultations, prescribing Ebọ Ìwà, and reconciling communal crises.",
      reqAse: 80,
    },
    {
      name: "Olúwo (Grand High Priest)",
      title: "The Sovereign Elder",
      desc: "Supreme custodian of cosmic balance, commanding 256 Odù and mentoring generations of diviners.",
      reqAse: 140,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Banner */}
      <div className="bg-zinc-900/90 border border-amber-900/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-950 flex items-center justify-center text-3xl shadow-lg border border-amber-400/40 shrink-0">
            📊
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-amber-200">
              Diviner's Telemetry & Mastery Metrics
            </h2>
            <p className="text-xs text-zinc-400">
              Real-time analytics tracking your character alignment (Ìwà Pẹ̀lẹ́), diagnostic accuracy, Odù mastery, and spiritual progression through ancient initiatory ranks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40">
            Current Rank: {divinerRank}
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
            Total Wisdom (Àṣẹ)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-amber-400">{wisdomAse}</span>
            <span className="text-xs text-zinc-500 font-mono">/ {maxWisdomAse} Pts</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Energy acquired from harmonizing panegyrics & ethical counsel.
          </p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
            Ìwà Pẹ̀lẹ́ (Character) Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-emerald-400">
              {iwaPeleAlignmentScore}%
            </span>
            <span className="text-xs text-emerald-500/80 font-mono">Noble</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Measures non-violent, integrity-first counsel decisions.
          </p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
            Seeker Crises Resolved
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-amber-200">
              {casesResolvedCount}
            </span>
            <span className="text-xs text-zinc-500 font-mono">Cases</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Real-life dilemmas counseled and brought to peace.
          </p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
            Odù Codex Mastery
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-purple-300">16 / 16</span>
            <span className="text-xs text-purple-400/80 font-mono">100%</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            All 16 Principal Méjì Odù unlocked in the Sacred Codex.
          </p>
        </div>
      </div>

      {/* Initiatory Rank Ladder */}
      <div className="bg-zinc-900/90 border border-amber-900/50 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-serif font-bold text-amber-200">
          The Sacred Initiatory Rank Progression
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ranks.map((r) => {
            const isUnlocked = wisdomAse >= r.reqAse;
            const isCurrent = divinerRank === r.name;

            return (
              <div
                key={r.name}
                className={`p-5 rounded-2xl border transition-all flex flex-col gap-2 ${
                  isCurrent
                    ? "bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-900/40"
                    : isUnlocked
                    ? "bg-zinc-950/80 border-emerald-800/40 text-zinc-300"
                    : "bg-zinc-950/40 border-zinc-850 text-zinc-600 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-amber-200">
                    {r.name}
                  </span>
                  {isUnlocked ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">
                      Req: {r.reqAse} Àṣẹ
                    </span>
                  )}
                </div>

                <span className="text-xs text-amber-300/80 font-serif italic">
                  "{r.title}"
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
