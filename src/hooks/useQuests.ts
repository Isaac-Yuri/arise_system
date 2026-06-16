import { useState } from "react";
import { supabase } from "../lib/supabase";
import { notify } from "../lib/toast";
import { GAME_CONFIG, type QuestRank } from "../config/gameConfig";
import { type DailyTask, type UserData } from "../types";

export function useQuests(player: UserData | null, setPlayer: React.Dispatch<React.SetStateAction<UserData | null>>) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const fetchTasks = async (userId: string) => {
    try {
      setLoadingTasks(true);
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Erro ao buscar missões diárias:", err);
      throw err;
    } finally {
      setLoadingTasks(false);
    }
  };

  const createTask = async (title: string, rank: QuestRank) => {
    if (!title.trim() || !player || isSubmittingTask) return;
    try {
      setIsSubmittingTask(true);
      const { data, error } = await supabase
        .from("daily_tasks")
        .insert([{ user_id: player.id, title: title.trim(), is_completed: false, difficulty_rank: rank }])
        .select()
        .single();

      if (error) throw error;
      if (data) setTasks((prev) => [...prev, data]);
    } catch (err) {
      console.error("Erro ao criar nova quest:", err);
      notify.error("Não foi possível criar a missão");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const wasCompleted = currentStatus;
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || !player) return;

    const questRank = (targetTask as any).difficulty_rank as QuestRank || "E";
    const xpReward = GAME_CONFIG.xp.byRank[questRank] || 25;
    const xpDelta = wasCompleted ? -xpReward : xpReward;

    // Optimistic Update
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_completed: !wasCompleted } : t)));

    try {
      const { error: taskError } = await supabase
        .from("daily_tasks")
        .update({ is_completed: !wasCompleted })
        .eq("id", taskId);

      if (taskError) throw taskError;

      const rawXp = player.xp + xpDelta;
      let newXp = Math.max(0, rawXp);
      let newLevel = player.level;
      let newRank = player.rank;
      let leveledUp = false;

      while (newXp >= GAME_CONFIG.xp.perLevel) {
        newLevel += 1;
        newXp = newXp - GAME_CONFIG.xp.perLevel;
        leveledUp = true;
      }

      if (leveledUp) {
        notify.levelUp(newLevel);
        const calculatedRank = GAME_CONFIG.playerRankByLevel(newLevel);
        if (calculatedRank !== newRank) newRank = calculatedRank;
      }

      const { error: userError } = await supabase
        .from("users")
        .update({ xp: newXp, level: newLevel, rank: newRank })
        .eq("id", player.id);

      if (userError) throw userError;

      setPlayer((prev) => (prev ? { ...prev, xp: newXp, level: newLevel, rank: newRank } : null));
    } catch (err) {
      console.error("Erro ao processar recompensa:", err);
      notify.error("Não foi possível atualizar a missão");
      // Rollback em caso de erro
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_completed: wasCompleted } : t)));
    }
  };

  const updateTaskText = async (taskId: string, newTitle: string) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t)));

    const { error } = await supabase.from("daily_tasks").update({ title: newTitle }).eq("id", taskId);
    if (error) {
      console.error("Erro ao editar quest:", error);
      notify.error("Não foi possível editar a missão");
      setTasks(originalTasks);
    }
  };

  const deleteTask = async (taskId: string) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const { error } = await supabase.from("daily_tasks").delete().eq("id", taskId);
    if (error) {
      console.error("Erro ao deletar quest:", error);
      notify.error("Não foi possível abandonar a missão");
      setTasks(originalTasks);
    }
  };

  return { tasks, loadingTasks, isSubmittingTask, fetchTasks, createTask, toggleTask, updateTaskText, deleteTask };
}