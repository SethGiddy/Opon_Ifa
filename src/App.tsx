/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SeekerChamber } from "./components/Seekers/SeekerChamber";
import { OponIfaTray } from "./components/Divination/OponIfaTray";
import { OrikiAcademy } from "./components/Oriki/OrikiAcademy";
import { AIIfaConsultation } from "./components/Oracle/AIIfaConsultation";
import { OduCodex } from "./components/Codex/OduCodex";
import { DivinerMetrics } from "./components/Analytics/DivinerMetrics";
import { DailyOriModal } from "./components/DailyOri/DailyOriModal";
import { DivinerRank, OduIfa, VocalMode } from "./types";
import { audioEngine } from "./services/audioEngine";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "seekers" | "opon" | "oriki" | "ai_consult" | "codex" | "metrics"
  >("seekers");

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [vocalMode, setVocalMode] = useState<VocalMode>("male");
  const [wisdomAse, setWisdomAse] = useState<number>(55);
  const [casesResolvedCount, setCasesResolvedCount] = useState<number>(2);
  const [iwaPeleAlignmentScore, setIwaPeleAlignmentScore] = useState<number>(92);

  const handleVocalModeChange = (mode: VocalMode) => {
    setVocalMode(mode);
    audioEngine.setVocalMode(mode);
    if (mode === "male") {
      audioEngine.playMaleVocal(140, 0.4);
    } else if (mode === "female") {
      audioEngine.playFemaleVocal(300, 0.4);
    } else {
      audioEngine.playDuetVocal(180, 0.5);
    }
  };

  // Daily Orí Alignment state
  const todayKey = new Date().toISOString().slice(0, 10);
  const [isOriClaimedToday, setIsOriClaimedToday] = useState<boolean>(() => {
    return localStorage.getItem(`ifa_ori_claimed_${todayKey}`) === "true";
  });

  const [isDailyOriOpen, setIsDailyOriOpen] = useState<boolean>(() => {
    // Automatically open on first login of the day if not yet completed
    const hasClaimed = localStorage.getItem(`ifa_ori_claimed_${todayKey}`) === "true";
    const hasSeen = localStorage.getItem(`ifa_ori_seen_${todayKey}`) === "true";
    return !hasClaimed && !hasSeen;
  });

  // Mark as seen once initialized
  useEffect(() => {
    localStorage.setItem(`ifa_ori_seen_${todayKey}`, "true");
  }, [todayKey]);

  // Compute Rank based on Wisdom Àṣẹ Points
  const getDivinerRank = (ase: number): DivinerRank => {
    if (ase >= 140) return "Olúwo (Grand High Priest)";
    if (ase >= 80) return "Babalawo (Master of Mysteries)";
    if (ase >= 40) return "Awoyẹ (Apprentice Diviner)";
    return "Akẹ́kọ̀ọ́ (Initiate)";
  };

  const currentRank = getDivinerRank(wisdomAse);

  const handleAwardWisdom = (points: number) => {
    setWisdomAse((prev) => Math.min(200, prev + points));
  };

  const handleClaimDailyAse = (points: number) => {
    setWisdomAse((prev) => Math.min(200, prev + points));
    setIsOriClaimedToday(true);
    setIwaPeleAlignmentScore((prev) => Math.min(100, prev + 1));
  };

  const handleCompleteCase = (growth: number) => {
    setWisdomAse((prev) => Math.min(200, prev + growth));
    setCasesResolvedCount((prev) => prev + 1);
    if (growth > 0) {
      setIwaPeleAlignmentScore((prev) => Math.min(100, prev + 2));
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setMuted(next);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        toggleMute={toggleMute}
        divinerRank={currentRank}
        wisdomAse={wisdomAse}
        maxWisdomAse={200}
        onOpenDailyOriModal={() => setIsDailyOriOpen(true)}
        isOriClaimedToday={isOriClaimedToday}
        vocalMode={vocalMode}
        onVocalModeChange={handleVocalModeChange}
      />

      {/* Main Shrine Sanctuary Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {activeTab === "seekers" && (
          <SeekerChamber
            divinerRank={currentRank}
            onCompleteCase={handleCompleteCase}
            onOpenDailyOriModal={() => setIsDailyOriOpen(true)}
          />
        )}

        {activeTab === "opon" && (
          <OponIfaTray />
        )}

        {activeTab === "oriki" && (
          <OrikiAcademy />
        )}

        {activeTab === "ai_consult" && (
          <AIIfaConsultation
            divinerRank={currentRank}
            onAwardWisdom={handleAwardWisdom}
          />
        )}

        {activeTab === "codex" && (
          <OduCodex />
        )}

        {activeTab === "metrics" && (
          <DivinerMetrics
            divinerRank={currentRank}
            wisdomAse={wisdomAse}
            maxWisdomAse={200}
            casesResolvedCount={casesResolvedCount}
            iwaPeleAlignmentScore={iwaPeleAlignmentScore}
          />
        )}
      </main>

      {/* Daily Orí Alignment Modal */}
      <DailyOriModal
        isOpen={isDailyOriOpen}
        onClose={() => setIsDailyOriOpen(false)}
        divinerRank={currentRank}
        onClaimAse={handleClaimDailyAse}
        wisdomAse={wisdomAse}
      />

      {/* Atmospheric Footer */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-4 px-4 text-center text-xs text-zinc-500 font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Òpó Ifá: The Panegyric Oracle • Rooted in Yoruba Philosophy & The 16 Principal Odù
          </span>
          <span className="text-[11px] text-amber-500/80 font-mono">
            Ìwà l’ẹ̀wà (Noble Character is Supreme Beauty)
          </span>
        </div>
      </footer>
    </div>
  );
}

