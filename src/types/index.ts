import { type QuestRank } from "../config/gameConfig";

// Entidades do banco de dados

export interface UserData {
  id: string;
  name: string;
  level: number;
  xp: number;
  rank: QuestRank;
  has_awakened: boolean;
}

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  difficulty_rank?: QuestRank;
  created_at?: string;
}