import React, { useState } from "react";
import { OduBinarySign, OduIfa } from "../../types";
import { THE_16_MEYI_ODU } from "../../data/ifaData";
import { audioEngine } from "../../services/audioEngine";
import { Sparkles, RotateCcw, Volume2, Info, BookOpen, CheckCircle2, Wand2 } from "lucide-react";

interface OponIfaTrayProps {
  onSelectOdu?: (odu: OduIfa) => void;
  preselectedPattern?: [
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign]
  ];
}

export const OponIfaTray: React.FC<OponIfaTrayProps> = ({
  onSelectOdu,
  preselectedPattern,
}) => {
  // 4 rows: [ [rightLeg, leftLeg], ... ]
  const [pattern, setPattern] = useState<[
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign]
  ]>(
    preselectedPattern || [
      ["I", "I"],
      ["I", "I"],
      ["I", "I"],
      ["I", "I"],
    ]
  );

  const [isCastingOpele, setIsCastingOpele] = useState<boolean>(false);
  const [activeTapperStrike, setActiveTapperStrike] = useState<boolean>(false);

  // Match pattern with 16 Principal Odù
  const matchedOdu = THE_16_MEYI_ODU.find((o) => {
    return o.pattern.every(
      (row, rIdx) => row[0] === pattern[rIdx][0] && row[1] === pattern[rIdx][1]
    );
  }) || null;

  const toggleStroke = (rowIdx: number, colIdx: number) => {
    audioEngine.playIyerosunDust();
    const next = pattern.map((row, r) =>
      row.map((val, c) => {
        if (r === rowIdx && c === colIdx) {
          return val === "I" ? "II" : "I";
        }
        return val;
      })
    ) as [
      [OduBinarySign, OduBinarySign],
      [OduBinarySign, OduBinarySign],
      [OduBinarySign, OduBinarySign],
      [OduBinarySign, OduBinarySign]
    ];
    setPattern(next);
  };

  const handleTapIroke = () => {
    setActiveTapperStrike(true);
    audioEngine.playIrokeTap();
    setTimeout(() => setActiveTapperStrike(false), 200);
  };

  const castOpeleChain = () => {
    setIsCastingOpele(true);
    audioEngine.playOpeleCast();

    // Randomize 8 binary seeds
    const newPattern: [
      [OduBinarySign, OduBinarySign],
      [OduBinarySign, OduBinarySign],
      [OduBinarySign, OduBinarySign],
      [OduBinarySign, OduBinarySign]
    ] = [
      [Math.random() > 0.5 ? "I" : "II", Math.random() > 0.5 ? "I" : "II"],
      [Math.random() > 0.5 ? "I" : "II", Math.random() > 0.5 ? "I" : "II"],
      [Math.random() > 0.5 ? "I" : "II", Math.random() > 0.5 ? "I" : "II"],
      [Math.random() > 0.5 ? "I" : "II", Math.random() > 0.5 ? "I" : "II"],
    ];

    setTimeout(() => {
      setPattern(newPattern);
      setIsCastingOpele(false);
      audioEngine.playSaworoChime();
    }, 450);
  };

  const selectPresetOdu = (odu: OduIfa) => {
    audioEngine.playIyerosunDust();
    setPattern(odu.pattern);
    if (onSelectOdu) onSelectOdu(odu);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-100 font-sans">
      {/* Shrine Intro Banner */}
      <div className="bg-zinc-900/90 border border-amber-900/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-900 flex items-center justify-center text-3xl shadow-lg border border-amber-400/40 shrink-0">
            🪞
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-amber-200">
              Ọpọ́n Ifá & Ọ̀pẹ̀lẹ̀ Divination Mat
            </h2>
            <p className="text-xs text-zinc-400">
              Interactive sacred circular divination tray coated in Ìyẹ̀ròsùn wood powder. Tap strokes or cast the Ọ̀pẹ̀lẹ̀ chain to decode cosmic Odù signatures.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTapIroke}
            className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              activeTapperStrike
                ? "bg-amber-400 text-zinc-950 border-white scale-105 shadow-lg shadow-amber-400/50"
                : "bg-zinc-950/80 text-amber-300 border-amber-500/40 hover:bg-zinc-850"
            }`}
          >
            <span>🪓</span>
            <span>Tap Ìrókẹ́ Tapper</span>
          </button>

          <button
            onClick={castOpeleChain}
            disabled={isCastingOpele}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold font-serif text-xs shadow-lg shadow-amber-900/40 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isCastingOpele ? "Casting Seeds..." : "Cast Ọ̀pẹ̀lẹ̀ Chain"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Ritual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: The Circular Ọpọ́n Ifá Tray */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-br from-amber-950 via-amber-900 to-zinc-950 border-8 border-amber-800/80 shadow-[0_0_50px_rgba(217,119,6,0.25)] flex items-center justify-center p-4 select-none">
            {/* Wooden Rim Carvings */}
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-500/30 pointer-events-none" />

            {/* Carved Face of Èṣù Ẹlẹ́gbára at the Apex */}
            <div className="absolute top-2 sm:top-3 flex flex-col items-center pointer-events-none z-10">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-zinc-950 border border-amber-500/60 flex items-center justify-center text-lg shadow-md">
                🗿
              </div>
              <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider mt-0.5">
                Èṣù Ẹlẹ́gbára
              </span>
            </div>

            {/* Inner Sacred Ìyẹ̀ròsùn Powder Circle */}
            <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[330px] md:h-[330px] rounded-full bg-gradient-to-br from-amber-200/20 via-amber-300/10 to-yellow-950/60 border border-amber-500/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 shadow-inner">
              <div className="text-[10px] font-mono text-amber-300/80 uppercase tracking-widest mb-1">
                Ìyẹ̀ròsùn Powder Surface
              </div>

              {/* 4 Rows of Binary Strokes (Right Leg & Left Leg) */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5 my-2">
                {pattern.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-8 sm:gap-12">
                    {/* Right Leg Column (Traditional Ifá reads Right then Left) */}
                    <button
                      onClick={() => toggleStroke(rIdx, 0)}
                      className={`w-14 sm:w-16 h-8 sm:h-9 rounded-xl font-mono font-extrabold text-sm sm:text-base border-2 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95 ${
                        row[0] === "I"
                          ? "bg-amber-400 text-zinc-950 border-white shadow-amber-400/50"
                          : "bg-zinc-900/90 text-amber-400 border-amber-500/60"
                      }`}
                      title={`Right Leg Row ${rIdx + 1}: Click to toggle I / II`}
                    >
                      {row[0] === "I" ? "I" : "I  I"}
                    </button>

                    {/* Left Leg Column */}
                    <button
                      onClick={() => toggleStroke(rIdx, 1)}
                      className={`w-14 sm:w-16 h-8 sm:h-9 rounded-xl font-mono font-extrabold text-sm sm:text-base border-2 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95 ${
                        row[1] === "I"
                          ? "bg-amber-400 text-zinc-950 border-white shadow-amber-400/50"
                          : "bg-zinc-900/90 text-amber-400 border-amber-500/60"
                      }`}
                      title={`Left Leg Row ${rIdx + 1}: Click to toggle I / II`}
                    >
                      {row[1] === "I" ? "I" : "I  I"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-8 sm:gap-12 text-[9px] font-mono text-zinc-400 mt-1">
                <span>Ọ̀tún (Right)</span>
                <span>Òsì (Left)</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-serif italic mt-3 text-center">
            Click any line stroke on the tray to toggle between <strong>Single (I)</strong> and <strong>Double (II)</strong> marks.
          </p>
        </div>

        {/* Right: Odù Reveal & Philosophical Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {matchedOdu ? (
            <div className="bg-zinc-900/90 border-2 border-amber-500/50 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Odù #{matchedOdu.index} of 16
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Element: {matchedOdu.element}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-amber-200 mt-1">
                    {matchedOdu.name} ({matchedOdu.yorubaName})
                  </h3>
                </div>

                <button
                  onClick={() => audioEngine.playToneChant("HIGH")}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
                  title="Chant Odù Tone"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Essence */}
              <div className="bg-zinc-950/80 border border-amber-600/30 rounded-2xl p-3.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                  Cosmic Essence
                </span>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans mt-0.5">
                  {matchedOdu.essence}
                </p>
              </div>

              {/* Yoruba Proverb (Òwe) */}
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] font-serif text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sacred Proverb (Òwe Ifá)</span>
                </span>
                <p className="text-sm font-serif italic text-amber-100 mt-0.5">
                  "{matchedOdu.proverb.yoruba}"
                </p>
                <p className="text-xs text-zinc-300 mt-1">
                  <strong>Translation:</strong> {matchedOdu.proverb.translation}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 border-t border-zinc-800/80 pt-1.5">
                  <strong>Life Application:</strong> {matchedOdu.proverb.philosophicalWisdom}
                </p>
              </div>

              {/* Panegyric Preview */}
              <div className="bg-purple-950/30 border border-purple-800/40 rounded-2xl p-3.5 flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">
                  Oríkì Panegyric Verse
                </span>
                <p className="text-xs font-serif italic text-purple-100">
                  "{matchedOdu.orikiStanza.yoruba}"
                </p>
                <p className="text-[11px] text-zinc-300">
                  {matchedOdu.orikiStanza.translation}
                </p>
              </div>

              {/* Real-life Themes Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchedOdu.realLifeThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[10px] bg-zinc-950 text-amber-300/90 border border-zinc-800"
                  >
                    ✦ {theme}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[300px]">
              <span className="text-3xl">🪞</span>
              <h4 className="font-serif font-bold text-amber-200">Assembling Compound Odù</h4>
              <p className="text-xs text-zinc-400 max-w-xs">
                This combination represents one of the 240 mixed minor Odù (Àmúlù). Align both legs to match one of the 16 Principal Méjì.
              </p>
            </div>
          )}

          {/* Quick Selection Palette of the 16 Méjì */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
              Quick Inscribe (16 Principal Méjì):
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {THE_16_MEYI_ODU.map((o) => (
                <button
                  key={o.id}
                  onClick={() => selectPresetOdu(o)}
                  className={`p-1.5 rounded-xl text-[10px] font-serif font-bold truncate transition-all cursor-pointer ${
                    matchedOdu?.id === o.id
                      ? "bg-amber-500 text-zinc-950 shadow-md"
                      : "bg-zinc-950/80 text-zinc-300 border border-zinc-850 hover:border-amber-500/40"
                  }`}
                  title={o.name}
                >
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
