import { AdaptiveTelemetry, DivinerRank } from "../types";

export class IfaAdaptiveEngine {
  public static calculateNextRank(aseScore: number): DivinerRank {
    if (aseScore >= 140) return "Olúwo (Grand High Priest)";
    if (aseScore >= 80) return "Babalawo (Master of Mysteries)";
    if (aseScore >= 40) return "Awoyẹ (Apprentice Diviner)";
    return "Akẹ́kọ̀ọ́ (Initiate)";
  }

  public static getAdaptiveProfile(rank: DivinerRank): AdaptiveTelemetry {
    switch (rank) {
      case "Olúwo (Grand High Priest)":
      case "Olúwo":
        return {
          rank,
          rankScore: 95,
          accuracyHistory: [92, 96, 98],
          consecutiveSuccesses: 5,
          consecutiveMistakes: 0,
          guidanceAssistActive: false,
          scoreMultiplier: 2.5,
          wisdomInsightLevel: 4,
          recentAssessments: ["PERFECT", "PERFECT", "GREAT"],
        };
      case "Babalawo (Master of Mysteries)":
      case "Babalawo":
        return {
          rank,
          rankScore: 80,
          accuracyHistory: [85, 90, 88],
          consecutiveSuccesses: 3,
          consecutiveMistakes: 0,
          guidanceAssistActive: false,
          scoreMultiplier: 2.0,
          wisdomInsightLevel: 3,
          recentAssessments: ["PERFECT", "GREAT", "GREAT"],
        };
      case "Awoyẹ (Apprentice Diviner)":
      case "Awoyẹ":
        return {
          rank,
          rankScore: 50,
          accuracyHistory: [75, 80, 82],
          consecutiveSuccesses: 1,
          consecutiveMistakes: 0,
          guidanceAssistActive: true,
          scoreMultiplier: 1.5,
          wisdomInsightLevel: 2,
          recentAssessments: ["GREAT", "FAIR", "GREAT"],
        };
      default:
        return {
          rank: "Akẹ́kọ̀ọ́ (Initiate)",
          rankScore: 20,
          accuracyHistory: [60, 70, 72],
          consecutiveSuccesses: 0,
          consecutiveMistakes: 0,
          guidanceAssistActive: true,
          scoreMultiplier: 1.0,
          wisdomInsightLevel: 1,
          recentAssessments: ["FAIR", "GREAT", "FAIR"],
        };
    }
  }
}
