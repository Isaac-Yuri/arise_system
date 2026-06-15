export const GAME_CONFIG = {
  xp: {
    perLevel: 100,
    byRank: {
      E: 10,
      D: 20,
      C: 40,
      B: 80,
      A: 150,
      S: 300,
    }
  },
  
  level: {
    min: 1,
  },

  playerRankByLevel: (level: number): 'E' | 'D' | 'C' | 'B' | 'A' | 'S' => {
    if (level >= 70) return 'S';
    if (level >= 55) return 'A';
    if (level >= 40) return 'B';
    if (level >= 25) return 'C';
    if (level >= 10) return 'D';
    return 'E';
  }
} as const;

export type QuestRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';