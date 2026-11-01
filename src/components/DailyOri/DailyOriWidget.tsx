import React from "react";
import { DivinerRank } from "../../types";
import { getDailyOriForRank, getYorubaDayName } from "../../data/dailyOriData";
import { Sparkles, Sun, Flame, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { audioEngine } from "../../services/audioEngine";

interface DailyOriWidgetProps {
  divinerRank: DivinerRank;
  onOpenModal: () => void;
}

export const DailyOriWidget: React.FC<DailyOriWidgetProps> = ({
  divinerRank,
  onOpenModal,
}) => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const isClaimedToday = localStorage.getItem(`ifa_ori_claimed_${todayKey}`) === "true";
  const streak = localStorage.getItem("ifa_ori_streak") || "1";
  const dailyData = getDailyOriForRank(divinerRank, todayKey);
  const yorubaDay = getYorubaDayName();

  const handleClick = () => {
    audioEngine.playIrokeTap();
    onOpenModal();
  };

  return (
    <div
      onClick={handleClick}
      className="w-full rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-amber-950/30 border border-amber-800/40 hover:border-amber-500/60 transition-all duration-200 p-4 shadow-md shadow-black/40 cursor-pointer group mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Icon, Yoruba Day, Affirmation teaser */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-inner shadow-amber-950">
            🌅
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wide bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                {yorubaDay.yorubaName}
              </span>
              <span className="text-[11px] text-zinc-400 font-serif">• Daily Orí Alignment</span>
            </div>
            <h4 className="text-sm md:text-base font-bold font-serif text-amber-100 group-hover:text-amber-300 transition-colors flex items-center gap-2">
              <span>{dailyData.title}</span>
              <span className="text-xs text-amber-400/70 font-normal hidden sm:inline">
                ({dailyData.governingOdu})
              </span>
            </h4>
            <p className="text-xs text-zinc-400 font-serif italic line-clamp-1 mt-0.5">
              "{dailyData.morningAffirmation}"
            </p>
          </div>
        </div>

        {/* Right Side: Status Badge, Streak, Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <div className="flex items-center gap-1.5 font-mono text-xs text-orange-300 bg-orange-950/30 px-2.5 py-1 rounded-full border border-orange-700/30">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>{streak}d Streak</span>
          </div>

          {isClaimedToday ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 text-xs font-serif font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aligned</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-zinc-950 text-xs font-serif font-bold group-hover:brightness-110 transition-all shadow-md shadow-amber-900/30">
              <Sparkles className="w-3 h-3 text-zinc-950" />
              <span>Consecrate (+10 Àṣẹ)</span>
            </div>
          )}

          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-300 transition-colors" />
        </div>
      </div>
    </div>
  );
};
