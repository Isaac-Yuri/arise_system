import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";

import { ProfileHeader } from "../components/ProfileHeader";
import { QuestForm } from "../components/QuestForm";
import { QuestItem } from "../components/QuestItem";
import { notify } from "../lib/toast";
import { GAME_CONFIG, type QuestRank } from "../config/gameConfig";

interface UserData {
  id: string;
  name: string;
  level: number;
  xp: number;
  rank: QuestRank;
}

interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
}

export default function Dashboard() {
  const [player, setPlayer] = useState<UserData | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: userDataArray, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id);

        if (userError) throw userError;

        const { data: tasksData, error: tasksError } = await supabase
          .from("daily_tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (tasksError) throw tasksError;

        if (!userDataArray || userDataArray.length === 0) {
          setPlayer({ id: user.id, name: "MONARCA ADORMECIDO", level: 1, xp: 0, rank: "E" });
        } else {
          setPlayer(userDataArray[0]);
        }
        setTasks(tasksData || []);
      } catch (err) {
        notify.error("Erro ao carregar dados do sistema Arise");
        console.error("Erro ao carregar dados do sistema Arise:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const xpPct = player ? Math.min(100, (player.xp / GAME_CONFIG.xp.perLevel) * 100) : 0;

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const wasCompleted = currentStatus;

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const questRank = (targetTask as any).difficulty_rank as QuestRank || "E";
    const xpReward = GAME_CONFIG.xp.byRank[questRank] || 25;

    const xpDelta = wasCompleted ? -xpReward : xpReward;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: !wasCompleted } : t))
    );

    try {
      const { error: taskError } = await supabase
        .from("daily_tasks")
        .update({ is_completed: !wasCompleted })
        .eq("id", taskId);

      if (taskError) throw taskError;

      if (!player) return;

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

      // Se subiu de nível (seja um ou mais), dispara a notificação e recalcula o Rank
      if (leveledUp) {
        notify.levelUp(newLevel);

        const calculatedRank = GAME_CONFIG.playerRankByLevel(newLevel);
        if (calculatedRank !== newRank) {
          newRank = calculatedRank;
        }
      }

      const { error: userError } = await supabase
        .from("users")
        .update({ xp: newXp, level: newLevel, rank: newRank })
        .eq("id", player.id);

      if (userError) throw userError;

      setPlayer((prev) => (prev ? { ...prev, xp: newXp, level: newLevel, rank: newRank } : null));

    } catch (err) {
      console.error("Erro ao processar recompensa da quest:", err);
      notify.error("Não foi possível atualizar a missão");

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: wasCompleted } : t))
      );
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
      setTasks(originalTasks);
    }
  };


  const handleCreateTask = async (title: string, rank: QuestRank) => {
    if (!title.trim() || !player || isSubmittingTask) return;

    try {
      setIsSubmittingTask(true);
      const { data, error } = await supabase
        .from("daily_tasks")
        .insert([
          {
            user_id: player.id,
            title: title.trim(),
            is_completed: false,
            difficulty_rank: rank // Injeta o rank selecionado no banco
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks((prev) => [...prev, data]);
        setIsAddingTask(false);
      }
    } catch (err) {
      console.error("Erro ao criar nova quest:", err);
      notify.error("Não foi possível criar a missão");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060a] font-mono text-xs uppercase tracking-widest text-sky-400 animate-pulse">
        [ Sincronizando com o Sistema... ]
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#05060a] text-zinc-100 font-sans antialiased selection:bg-sky-500/40">
      {/* Efeitos de Fundo de Neon Shadow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl md:h-96 md:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl md:h-96 md:w-96" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:max-w-xl md:gap-6 md:px-8 md:py-10 lg:max-w-2xl lg:px-10 lg:py-12">

        {/* 1. Componente de Perfil */}
        <ProfileHeader player={player} xpPct={xpPct} xpMax={GAME_CONFIG.xp.perLevel} />

        {/* Painel Central de Quests */}
        <section className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur md:p-5 lg:p-6">
          <div className="mb-4 border-b border-zinc-800 pb-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-sky-400/80">Daily Quest</p>
              <h2 className="mt-1 text-sm font-bold uppercase tracking-wide text-zinc-100 sm:text-base md:text-lg">
                Prepare to Get Stronger
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-400 transition-all hover:border-sky-500/50 hover:text-sky-400 active:scale-95"
              title="Adicionar Nova Missão Diária"
            >
              <svg className={`h-4 w-4 transition-transform duration-200 ${isAddingTask ? "rotate-45 text-red-400" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          {/* 2. Componente de Formulário */}
          <QuestForm
            isOpen={isAddingTask}
            onClose={() => setIsAddingTask(false)}
            onSubmit={handleCreateTask}
            isSubmitting={isSubmittingTask}
          />

          {tasks.length === 0 ? (
            <p className="text-center py-6 font-mono text-xs text-zinc-600 uppercase tracking-wider">
              Nenhuma quest ativa no painel.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 md:gap-3">
              {tasks.map((task) => (
                /* 3. Componente de Item da Lista */
                <QuestItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onUpdateText={updateTaskText}
                />
              ))}
            </ul>
          )}

          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 md:mt-4">
            {completedCount} / {tasks.length} objetivos completos
          </p>
        </section>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-700">
          Sistema Arise · v0.1
        </p>
      </div>
    </main>
  );
}