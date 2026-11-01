import React from "react";
import { DivinerRank, VocalMode } from "../types";
import { Sparkles, Volume2, VolumeX, BookOpen, Compass, Award, Activity, Music, Feather, Mic } from "lucide-react";
import { audioEngine } from "../services/audioEngine";

interface HeaderProps {
  activeTab: "seekers" | "opon" | "oriki" | "ai_consult" | "codex" | "metrics";
  setActiveTab: (tab: "seekers" | "opon" | "oriki" | "ai_consult" | "codex" | "metrics") => void;
  isMuted: boolean;
  toggleMute: () => void;
  divinerRank: DivinerRank;
  wisdomAse: number;
  maxWisdomAse: number;
  onOpenDailyOriModal: () => void;
  isOriClaimedToday: boolean;
  vocalMode: VocalMode;
  onVocalModeChange: (mode: VocalMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  toggleMute,
  divinerRank,
  wisdomAse,
  maxWisdomAse,
  onOpenDailyOriModal,
  isOriClaimedToday,
  vocalMode,
  onVocalModeChange,
}) => {
  const tabs = [
    { id: "seekers", label: "Seeker's Chamber", icon: "🏛️" },
    { id: "opon", label: "Ọpọ́n & Ọ̀pẹ̀lẹ̀ Ritual", icon: "🪞" },
    { id: "oriki", label: "Oríkì Academy", icon: "🪘" },
    { id: "ai_consult", label: "AI Ifá Oracle", icon: "🐚" },
    { id: "codex", label: "The 16 Odù Codex", icon: "📖" },
    { id: "metrics", label: "Diviner's Telemetry", icon: "📊" },
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    audioEngine.playIrokeTap();
    setActiveTab(tabId);
  };

  const handleOpenOri = () => {
    audioEngine.playIrokeTap();
    onOpenDailyOriModal();
  };

  return (
    <header className="w-full bg-zinc-950/95 border-b border-amber-900/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border-2 border-amber-400/60 shadow-lg flex items-center justify-center text-2xl shadow-amber-900/40">
            🪞
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-serif tracking-tight text-amber-200">
                Òpó Ifá
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Sacred Panegyrics
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-serif italic">
              Solving Real-Life Human Crises Through Yoruba Ifá Wisdom & Oríkì
            </p>
          </div>
        </div>

        {/* Global HUD Stats: Daily Orí Alignment, Diviner Rank, Àṣẹ Wisdom Energy, Sound Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
          {/* Daily Orí Alignment Trigger Button */}
          <button
            onClick={handleOpenOri}
            className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isOriClaimedToday
                ? "bg-zinc-900/90 text-amber-300 border-amber-900/40 hover:border-amber-500/60"
                : "bg-gradient-to-r from-amber-600 to-orange-600 text-zinc-950 border-amber-300 hover:brightness-110 shadow-amber-900/40 animate-pulse"
            }`}
            title="Open Daily Orí Morning Prayer & Affirmation"
          >
            <span>🌅</span>
            <span>Daily Orí</span>
            {!isOriClaimedToday && (
              <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
            )}
          </button>

          {/* Diviner Rank Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-800/40 shadow-sm text-xs">
            <span className="text-amber-400 text-sm">👑</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 uppercase font-mono leading-none">Rank</span>
              <span className="font-serif font-bold text-amber-200 text-xs">{divinerRank}</span>
            </div>
          </div>

          {/* Àṣẹ Wisdom Gauge */}
          <div className="flex flex-col gap-1 w-28 md:w-36 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-amber-300 font-serif flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Àṣẹ (Wisdom)</span>
              </span>
              <span className="text-amber-400 font-bold">{wisdomAse}%</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-amber-900/30 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (wisdomAse / maxWisdomAse) * 100)}%` }}
              />
            </div>
          </div>

          {/* Vocal Mode Selector (Male / Female / Duet) */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => onVocalModeChange("male")}
              className={`px-2 py-1 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer ${
                vocalMode === "male"
                  ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Male Babalawo Vocal (Resonant Chest)"
            >
              <span>👨</span>
              <span className="hidden sm:inline text-[11px]">Male</span>
            </button>
            <button
              onClick={() => onVocalModeChange("female")}
              className={`px-2 py-1 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer ${
                vocalMode === "female"
                  ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Female Ìyánífá / Arókin Vocal (Lyrical Soprano)"
            >
              <span>👩</span>
              <span className="hidden sm:inline text-[11px]">Female</span>
            </button>
            <button
              onClick={() => onVocalModeChange("duet")}
              className={`px-2 py-1 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer ${
                vocalMode === "duet"
                  ? "bg-amber-900/40 text-amber-200 font-bold border border-amber-400/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Sacred Duet (Harmonized Counterpoint)"
            >
              <span>🕊️</span>
              <span className="hidden sm:inline text-[11px]">Duet</span>
            </button>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-300 hover:border-amber-500/50 transition-colors cursor-pointer"
            title={isMuted ? "Unmute Sacred Soundscape" : "Mute Soundscape"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/50 scale-102 border border-amber-400/40"
                  : "bg-zinc-900/70 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
