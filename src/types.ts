export type OduBinarySign = "I" | "II"; // "I" = single stroke (open), "II" = double stroke (closed)

export type VocalMode = "male" | "female" | "duet";

export type YorubaTone = "DÒ" | "RE" | "MÍ";

export interface YorubaSyllable {
  syllable: string;
  tone: YorubaTone;
  accentMark: "\\" | "-" | "/";
  pitchHz: {
    male: number;
    female: number;
  };
}

export type DivinerRank =
  | "Akẹ́kọ̀ọ́"
  | "Awoyẹ"
  | "Babalawo"
  | "Olúwo"
  | "Akẹ́kọ̀ọ́ (Initiate)"
  | "Awoyẹ (Apprentice Diviner)"
  | "Babalawo (Master of Mysteries)"
  | "Olúwo (Grand High Priest)";

export interface OduIfa {
  id: string;
  name: string;
  yorubaName: string;
  index: number;
  pattern: [
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign]
  ];
  element: "Light" | "Earth" | "Water" | "Fire" | "Air" | "Iron" | "Cosmos";
  essence: string;
  symbolicMeaning: string;
  proverb: {
    yoruba: string;
    translation: string;
    philosophicalWisdom: string;
  };
  orikiStanza: {
    yoruba: string;
    translation: string;
    chantTones: Array<"LOW" | "MID" | "HIGH">;
  };
  eseIfaStory: {
    ancientDiviners: string;
    historicalConsultant: string;
    mythologicalDilemma: string;
    prescribedEbo: string;
    moralOutcome: string;
  };
  realLifeThemes: string[];
}

export interface SeekerDilemma {
  id: string;
  name: string;
  title: string;
  avatar: string;
  category:
    | "Career & Purpose"
    | "Family & Lineage"
    | "Ethics & Justice"
    | "Health & Grief"
    | "Love & Trust"
    | "Communal Leadership";
  context:
    | "Modern Diaspora"
    | "Traditional Realm"
    | "Contemporary African City"
    | "Futuristic Megacity";
  backgroundNarrative: string;
  dilemmaSummary: string;
  emotionalState: string;
  associatedOduId: string;
  panegyricRequirement: {
    targetOriki: string;
    stanzas: string[];
    correctOrder: number[];
  };
  counselChoices: Array<{
    id: string;
    title: string;
    description: string;
    philosophicalAlignment:
      | "Iwapele (Nobility & Truth)"
      | "Arrogance & Haste"
      | "Cowardice & Compromise"
      | "Superficial Quick-Fix";
    prescribedAction: string;
    isOptimal: boolean;
    consequenceStory: string;
    spiritualGrowth: number;
  }>;
}

export interface PanegyricOrikiLesson {
  id: string;
  title: string;
  deityOrConcept:
    | "Orí (Inner Destiny)"
    | "Ọ̀rúnmìlà (Wisdom)"
    | "Ilẹ̀ (Earth & Ancestors)"
    | "Ògún (Action & Labor)"
    | "Ọ̀ṣun (Harmony & Compassion)";
  description: string;
  yorubaVerses: Array<{
    line: string;
    translation: string;
    tone: "LOW" | "MID" | "HIGH";
    audioPitchHz: number;
  }>;
  culturalLesson: string;
  realLifeApplication: string;
}

export interface AdaptiveTelemetry {
  rank: DivinerRank;
  rankScore: number; // 0-100
  accuracyHistory: number[];
  consecutiveSuccesses: number;
  consecutiveMistakes: number;
  guidanceAssistActive: boolean;
  scoreMultiplier: number;
  wisdomInsightLevel: number;
  recentAssessments: Array<"PERFECT" | "GREAT" | "FAIR" | "MISALIGNED">;
  adaptationNotice?: {
    message: string;
    direction: "UP" | "DOWN" | "STABLE";
    timestamp: number;
  };
}

export interface DivinationSessionState {
  currentSeeker: SeekerDilemma | null;
  opeleCastResults: [
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign],
    [OduBinarySign, OduBinarySign]
  ] | null;
  revealedOdu: OduIfa | null;
  step:
    | "invocation"
    | "opele_cast"
    | "opon_marking"
    | "panegyric_chant"
    | "counsel_seeker"
    | "resolution";
  selectedCounselId: string | null;
  panegyricChantScore: number;
}

export interface DailyOriAlignment {
  id: string;
  rank: DivinerRank;
  title: string;
  yorubaGreeting: string;
  yorubaPrayer: string;
  englishTranslation: string;
  morningAffirmation: string;
  oriFocusTheme: string;
  governingOdu: string;
  oduSign: [OduBinarySign, OduBinarySign][];
  philosophicalReflection: string;
  dailyCharacterDiscipline: string; // Ìwà Pẹ̀lẹ́ micro-action
  chantTones: Array<"LOW" | "MID" | "HIGH">;
}

export interface DailyOriState {
  lastCompletedDate: string | null;
  currentStreak: number;
  totalAlignments: number;
  isTodayClaimed: boolean;
}

