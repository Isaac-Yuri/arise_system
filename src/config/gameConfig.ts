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

  // ==========================================
  // NOVO: SISTEMA DE RECOMPENSA EM ARISE COINS
  // ==========================================
  coins: {
    byRank: {
      E: 1,   // Rank E (Iniciante)
      D: 5,   // Rank D (Fácil)
      C: 10,   // Rank C (Médio)
      B: 25,  // Rank B (Difícil)
      A: 50,  // Rank A (Perigoso)
      S: 100, // Rank S (Monarca)
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