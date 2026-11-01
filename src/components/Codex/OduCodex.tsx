import React, { useState } from "react";
import { OduIfa, VocalMode } from "../../types";
import { THE_16_MEYI_ODU } from "../../data/ifaData";
import { audioEngine } from "../../services/audioEngine";
import { BookOpen, Volume2, Sparkles, Filter, Search, Mic } from "lucide-react";

export const OduCodex: React.FC = () => {
  const [selectedOduId, setSelectedOduId] = useState<string>("eji_ogbe");
  const [elementFilter, setElementFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vocalVoice, setVocalVoice] = useState<VocalMode>("male");
  const [isReciting, setIsReciting] = useState<boolean>(false);
  const [isPureChanting, setIsPureChanting] = useState<boolean>(false);
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number | null>(null);

  const filteredOduList = THE_16_MEYI_ODU.filter((odu) => {
    const matchesElement = elementFilter === "ALL" || odu.element.toUpperCase() === elementFilter.toUpperCase();
    const matchesSearch =
      odu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      odu.yorubaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      odu.essence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      odu.realLifeThemes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesElement && matchesSearch;
  });

  const selectedOdu = THE_16_MEYI_ODU.find((o) => o.id === selectedOduId) || THE_16_MEYI_ODU[0];

  const handleSelectOdu = (odu: OduIfa) => {
    audioEngine.playIyerosunDust();
    setSelectedOduId(odu.id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Codex Banner */}
      <div className="bg-zinc-900/90 border border-amber-900/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-zinc-950 flex items-center justify-center text-3xl shadow-lg border border-amber-400/40 shrink-0">
            📖
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-amber-200">
              The 16 Principal Odù Codex (Àwọn Méjì Èjìlá)
            </h2>
            <p className="text-xs text-zinc-400">
              The fundamental cosmic binary matrix of Yoruba wisdom. Explore sacred verses, proverbs (Òwe), ancient mythological precedents, and practical life applications.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "Light", "Earth", "Fire", "Water", "Air", "Iron"].map((elem) => (
            <button
              key={elem}
              onClick={() => setElementFilter(elem)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                elementFilter === elem
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "bg-zinc-950/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
              }`}
            >
              {elem}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Scrollable 16 Odù Grid */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Odù name, proverb, or real-life theme..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredOduList.map((odu) => {
              const isSelected = selectedOdu.id === odu.id;
              return (
                <button
                  key={odu.id}
                  onClick={() => handleSelectOdu(odu)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-900/40 scale-101"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-amber-600/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Mini Binary Badge */}
                    <div className="flex flex-col gap-0.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
                      {odu.pattern.map((row, r) => (
                        <div key={r} className="flex gap-1 text-[8px] font-mono text-amber-400 font-bold">
                          <span>{row[0]}</span>
                          <span>{row[1]}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-bold text-amber-200">
                          {odu.name}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">#{odu.index}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 line-clamp-1">
                        {odu.essence}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-amber-300/80 border border-zinc-800">
                    {odu.element}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Odù Inspector */}
        <div className="lg:col-span-7 bg-zinc-900/90 border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Principal Odù #{selectedOdu.index} of 16
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Element: {selectedOdu.element}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-amber-200 mt-1">
                {selectedOdu.name} ({selectedOdu.yorubaName})
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">{selectedOdu.essence}</p>
            </div>

            <button
              onClick={() => audioEngine.playToneChant("HIGH")}
              className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-amber-300 hover:text-amber-200 cursor-pointer"
              title="Chant Odù Tone"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Binary Signature Matrix */}
          <div className="bg-zinc-950/80 border border-amber-600/30 rounded-2xl p-4 flex items-center justify-around">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Binary Matrix</span>
              <div className="flex flex-col gap-1.5 bg-amber-950/30 p-3 rounded-xl border border-amber-500/30">
                {selectedOdu.pattern.map((row, r) => (
                  <div key={r} className="flex gap-4 font-mono font-bold text-amber-400 text-xs">
                    <span className="w-6 text-center">{row[0] === "I" ? "I" : "II"}</span>
                    <span className="w-6 text-center">{row[1] === "I" ? "I" : "II"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-xs flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                Symbolic Meaning
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {selectedOdu.symbolicMeaning}
              </p>
            </div>
          </div>

          {/* Yoruba Proverb with Vocal Recitation */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] font-serif uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sacred Proverb (Òwe Ifá)</span>
              </span>

              <div className="flex items-center gap-1.5">
                {/* Voice toggle */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                  <button
                    onClick={() => {
                      setVocalVoice("male");
                      audioEngine.playMaleVocal(140, 0.3);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-serif cursor-pointer ${
                      vocalVoice === "male"
                        ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    👨 Male
                  </button>
                  <button
                    onClick={() => {
                      setVocalVoice("female");
                      audioEngine.playFemaleVocal(300, 0.3);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-serif cursor-pointer ${
                      vocalVoice === "female"
                        ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    👩 Female
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (isPureChanting) {
                        audioEngine.stopVocalRecitation();
                        setIsPureChanting(false);
                        setActiveSyllableIdx(null);
                        return;
                      }
                      setIsPureChanting(true);
                      audioEngine.chantPureYorubaVerse(
                        selectedOdu.proverb.yoruba,
                        vocalVoice,
                        (idx) => setActiveSyllableIdx(idx),
                        () => {
                          setIsPureChanting(false);
                          setActiveSyllableIdx(null);
                        }
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-serif flex items-center gap-1 cursor-pointer transition-all ${
                      isPureChanting
                        ? "bg-amber-400 text-zinc-950 border-white animate-pulse font-bold"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                    }`}
                    title="Chant with Pure Yoruba DÒ-RE-MÍ tones"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{isPureChanting ? "Chanting..." : "Pure Chant"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isReciting) {
                        audioEngine.stopVocalRecitation();
                        setIsReciting(false);
                        return;
                      }
                      setIsReciting(true);
                      audioEngine.recitePanegyricVerse(
                        selectedOdu.proverb.yoruba,
                        vocalVoice,
                        ["HIGH", "MID"],
                        () => setIsReciting(false)
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-serif flex items-center gap-1 cursor-pointer transition-all ${
                      isReciting
                        ? "bg-purple-600 text-white border-purple-400 animate-pulse"
                        : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-purple-300 hover:border-purple-500/40"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px]">{isReciting ? "Reciting..." : "Recite"}</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm font-serif italic text-amber-100">
              "{selectedOdu.proverb.yoruba}"
            </p>

            {/* Interactive Syllable Badges */}
            <div className="flex items-center gap-1 flex-wrap pt-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase mr-1">Àmì Ohùn:</span>
              {audioEngine.parseYorubaTextToSyllablesAndTones(selectedOdu.proverb.yoruba).map((syl, sIdx) => {
                const isSyllableActive = isPureChanting && activeSyllableIdx === sIdx;
                return (
                  <button
                    key={sIdx}
                    onClick={() => audioEngine.playPureYorubaTone(syl.tone, vocalVoice, 0.45)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all border cursor-pointer ${
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
                    {syl.syllable} <span className="text-[8px] opacity-75">{syl.tone}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-300">
              <strong>Translation:</strong> {selectedOdu.proverb.translation}
            </p>
            <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-1.5 mt-1">
              <strong>Life Guidance:</strong> {selectedOdu.proverb.philosophicalWisdom}
            </p>
          </div>

          {/* Ẹsẹ Ifá Mythological Narrative */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
              Mythological Precedent & Ancient Diviners
            </span>
            <div className="text-xs text-zinc-200 flex flex-col gap-1 font-sans">
              <p>
                <strong className="text-amber-300">Ancient Diviners:</strong>{" "}
                {selectedOdu.eseIfaStory.ancientDiviners}
              </p>
              <p>
                <strong className="text-amber-300">Historical Consultant:</strong>{" "}
                {selectedOdu.eseIfaStory.historicalConsultant}
              </p>
              <p>
                <strong className="text-amber-300">Dilemma:</strong>{" "}
                {selectedOdu.eseIfaStory.mythologicalDilemma}
              </p>
              <p>
                <strong className="text-amber-300">Prescribed Ebọ:</strong>{" "}
                {selectedOdu.eseIfaStory.prescribedEbo}
              </p>
              <p>
                <strong className="text-emerald-400">Moral Outcome:</strong>{" "}
                {selectedOdu.eseIfaStory.moralOutcome}
              </p>
            </div>
          </div>

          {/* Real-Life Theme Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedOdu.realLifeThemes.map((theme, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl text-xs bg-zinc-950 text-amber-300 border border-zinc-800"
              >
                ✦ {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
