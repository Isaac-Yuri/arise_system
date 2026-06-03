import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { QuestItem } from "../components/QuestItem"; // Importando o novo componente

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

  // Alternar conclusão
  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    if (claimed) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
    );

    const { error } = await supabase
      .from("daily_tasks")
      .update({ is_completed: !currentStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: currentStatus } : t))
      );
    }
  };

  // FUNCIONALIDADE NOVA: Editar texto da Quest
  const updateTaskText = async (taskId: string, newTitle: string) => {
    const originalTasks = [...tasks];
    
    // Atualização otimista na UI
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t)));

    const { error } = await supabase
      .from("daily_tasks")
      .update({ title: newTitle })
      .eq("id", taskId);

    if (error) {
      console.error("Erro ao editar quest:", error);
      setTasks(originalTasks); // Desfaz em caso de erro
    }
  };

  // FUNCIONALIDADE NOVA: Deletar Quest
  const deleteTask = async (taskId: string) => {
    const originalTasks = [...tasks];

    // Remoção otimista na UI
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const { error } = await supabase
      .from("daily_tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Erro ao deletar quest:", error);
      setTasks(originalTasks); // Recarrega a lista antiga em caso de erro
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
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ xp: newXp, level: newLevel })
        .eq("id", player.id);

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
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl md:h-96 md:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl md:h-96 md:w-96" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:max-w-xl md:gap-6 md:px-8 md:py-10 lg:max-w-2xl lg:px-10 lg:py-12">
        
        {/* Header Container */}
        <header className="rounded-xl border border-sky-500/20 bg-zinc-950/70 p-4 shadow-[0_0_30px_-15px_rgba(56,189,248,0.6)] backdrop-blur md:p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-sky-400/80">Player:</p>
              <h1 className="truncate text-base font-bold uppercase tracking-wider text-zinc-50 sm:text-lg md:text-xl">
                {player?.name || "UNKNOWN MONARCH"}
              </h1>
            </div>
            <span className="shrink-0 rounded-md border border-sky-400/60 bg-sky-500/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-300 shadow-[0_0_15px_-5px_rgba(56,189,248,0.8)] md:text-xs md:px-3">
              LVL {String(player?.level || 1).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 md:mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/80 ring-1 ring-inset ring-zinc-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.9)] transition-all duration-700 ease-out"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              XP: {player?.xp || 0} / 100
            </p>
          </div>
        </header>

        {/* Quests Container */}
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

          {isAddingTask && (
            <form onSubmit={handleCreateTask} className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200 flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Digitar nova quest diária..."
                required
                disabled={isSubmittingTask}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmittingTask}
                className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-400 hover:bg-sky-500/20 disabled:opacity-50"
              >
                {isSubmittingTask ? "..." : "Fixar"}
              </button>
            </form>
          )}

          {tasks.length === 0 ? (
            <p className="text-center py-6 font-mono text-xs text-zinc-600 uppercase tracking-wider">
              Nenhuma quest ativa no painel.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 md:gap-3">
              {tasks.map((task) => (
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

        {/* Reward Button */}
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