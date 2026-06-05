import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// importações dos subcomponentes
import { ProfileHeader } from "../components/ProfileHeader";
import { QuestForm } from "../components/QuestForm";
import { QuestItem } from "../components/QuestItem";

interface UserData {
  id: string;
  name: string;
  level: number;
  xp: number;
}

interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function Dashboard() {
  const [player, setPlayer] = useState<UserData | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
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
          setPlayer({ id: user.id, name: "MONARCA ADORMECIDO", level: 1, xp: 0 });
        } else {
          setPlayer(userDataArray[0]);
        }
        setTasks(tasksData || []);
      } catch (err) {
        console.error("Erro ao carregar dados do sistema Arise:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const allDone = tasks.length > 0 && tasks.every((t) => t.is_completed);
  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const xpPct = player ? Math.min(100, (player.xp / 100) * 100) : 0;

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    if (claimed) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_completed: !currentStatus } : t)));
    
    const { error } = await supabase.from("daily_tasks").update({ is_completed: !currentStatus }).eq("id", taskId);
    if (error) {
      console.error("Erro ao atualizar status:", error);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_completed: currentStatus } : t)));
    }
  };

  const updateTaskText = async (taskId: string, newTitle: string) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t)));

    const { error } = await supabase.from("daily_tasks").update({ title: newTitle }).eq("id", taskId);
    if (error) {
      console.error("Erro ao editar quest:", error);
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !player || isSubmittingTask) return;

    try {
      setIsSubmittingTask(true);
      const { data, error } = await supabase
        .from("daily_tasks")
        .insert([{ user_id: player.id, title: newTaskTitle.trim(), is_completed: false }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks((prev) => [...prev, data]);
        setNewTaskTitle("");
        setIsAddingTask(false);
      }
    } catch (err) {
      console.error("Erro ao criar nova quest:", err);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const claimReward = async () => {
    if (!allDone || claimed || !player) return;

    setClaimed(true);
    let newXp = player.xp + 25;
    let newLevel = player.level;

    if (newXp >= 100) {
      newLevel += 1;
      newXp = newXp - 100;
    }

    try {
      const { error: userUpdateError } = await supabase.from("users").update({ xp: newXp, level: newLevel }).eq("id", player.id);
      if (userUpdateError) throw userUpdateError;
      setPlayer((prev) => (prev ? { ...prev, xp: newXp, level: newLevel } : null));
    } catch (err) {
      console.error("Erro ao computar recompensa:", err);
    } finally {
      setClaimed(false);
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
        <ProfileHeader player={player} xpPct={xpPct} />

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
            isAddingTask={isAddingTask}
            newTaskTitle={newTaskTitle}
            isSubmittingTask={isSubmittingTask}
            setNewTaskTitle={setNewTaskTitle}
            onSubmit={handleCreateTask}
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
                  claimed={claimed}
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

        {/* Botão de Resgatar Recompensa */}
        <button
          type="button"
          onClick={claimReward}
          disabled={!allDone || claimed}
          className={`w-full rounded-xl border px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 sm:text-sm md:py-4 md:text-base ${
            allDone && !claimed
              ? "border-sky-400 bg-gradient-to-b from-sky-500/20 to-sky-500/5 text-sky-200 shadow-[0_0_25px_-5px_rgba(56,189,248,0.9)] hover:from-sky-500/30 hover:to-sky-500/10 hover:shadow-[0_0_35px_-2px_rgba(56,189,248,1)] active:scale-[0.98]"
              : "cursor-not-allowed border-zinc-800 bg-zinc-900/50 text-zinc-600"
          }`}
        >
          {claimed ? "[ REWARD CLAIMED ]" : "[ CLAIM REWARD (+25 XP) ]"}
        </button>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-700">
          Sistema Arise · v0.1
        </p>
      </div>
    </main>
  );
}