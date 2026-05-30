import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// Definição das tipagens do TypeScript com base no seu banco
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

// Substitua por um UUID real cadastrado na sua tabela public.users para testar
const USER_ID_TEST = "8b7b1d71-1cad-4069-90f7-b995d1192062";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function Dashboard() {
  const [player, setPlayer] = useState<UserData | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  // Carrega os dados do jogador e as tarefas ao montar o componente
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // 1. Busca dados do usuário
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", USER_ID_TEST)
          .single();
        
        console.log("Dados do usuário carregados:", userData);

        if (userError) throw userError;

        // 2. Busca as tarefas diárias do usuário
        const { data: tasksData, error: tasksError } = await supabase
          .from("daily_tasks")
          .select("*")
          .eq("user_id", USER_ID_TEST)
          .order("created_at", { ascending: true });

        if (tasksError) throw tasksError;

        setPlayer(userData);
        setTasks(tasksData || []);
      } catch (err) {
        console.error("Erro ao carregar dados do sistema Arise:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Cálculos de progresso derivados do estado real do banco
  const allDone = tasks.length > 0 && tasks.every((t) => t.is_completed);
  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const xpPct = player ? Math.min(100, (player.xp / 100) * 100) : 0;

  // Atualiza o estado da tarefa em tempo real no banco de dados ao clicar
  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    if (claimed) return;

    // Otimismo na UI: atualiza localmente primeiro para resposta instantânea
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
    );

    const { error } = await supabase
      .from("daily_tasks")
      .update({ is_completed: !currentStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Erro ao atualizar tarefa:", error);
      // Reverte o estado em caso de erro no servidor
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: currentStatus } : t))
      );
    }
  };

  // Recompensa: Adiciona XP, calcula Level Up e limpa as tarefas no banco
  const claimReward = async () => {
    if (!allDone || claimed || !player) return;

    setClaimed(true);

    let newXp = player.xp + 25;
    let newLevel = player.level;

    // Mecânica de Level Up ao atingir ou passar de 100 XP
    if (newXp >= 100) {
      newLevel += 1;
      newXp = newXp - 100; // Mantém o restante do XP para o próximo nível
    }

    try {
      // 1. Atualiza dados do jogador no Supabase
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ xp: newXp, level: newLevel })
        .eq("id", player.id);

      if (userUpdateError) throw userUpdateError;

      // 2. Reseta o status das tarefas diárias para falso no banco
      const { error: tasksUpdateError } = await supabase
        .from("daily_tasks")
        .update({ is_completed: false })
        .eq("user_id", player.id);

      if (tasksUpdateError) throw tasksUpdateError;

      // Sincroniza o estado local após a animação de sucesso
      setTimeout(() => {
        setPlayer((prev) => (prev ? { ...prev, xp: newXp, level: newLevel } : null));
        setTasks((prev) => prev.map((t) => ({ ...t, is_completed: false })));
        setClaimed(false);
      }, 1200);

    } catch (err) {
      console.error("Erro ao computar recompensa:", err);
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
      {/* Ambient aura */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl md:h-96 md:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl md:h-96 md:w-96" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:max-w-xl md:gap-6 md:px-8 md:py-10 lg:max-w-2xl lg:px-10 lg:py-12">
        
        {/* 1. STATUS PANEL */}
        <header className="rounded-xl border border-sky-500/20 bg-zinc-950/70 p-4 shadow-[0_0_30px_-15px_rgba(56,189,248,0.6)] backdrop-blur md:p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-sky-400/80">
                Player:
              </p>
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

        {/* 2. DAILY QUESTS */}
        <section className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur md:p-5 lg:p-6">
          <div className="mb-3 border-b border-zinc-800 pb-2.5 md:mb-4 md:pb-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-sky-400/80">
              Daily Quest
            </p>
            <h2 className="mt-1 text-sm font-bold uppercase tracking-wide text-zinc-100 sm:text-base md:text-lg">
              Prepare to Get Stronger
            </h2>
          </div>

          {tasks.length === 0 ? (
            <p className="text-center py-6 font-mono text-xs text-zinc-600 uppercase tracking-wider">
              Nenhuma quest ativa no painel.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 md:gap-3">
              {tasks.map((task) => {
                const checked = task.is_completed;
                return (
                  <li key={task.id}>
                    <label
                      className={`group flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-all md:px-4 md:py-3.5 ${
                        checked
                          ? "border-sky-500/30 bg-sky-500/5"
                          : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTask(task.id, checked)}
                        className="sr-only"
                        disabled={claimed}
                      />
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                          checked
                            ? "border-sky-400 bg-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                            : "border-zinc-600 group-hover:border-sky-500/60"
                        }`}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3.5 w-3.5 text-sky-300"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8.5l3.5 3.5L13 5" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm leading-snug transition-all ${
                          checked
                            ? "text-zinc-500 line-through opacity-60"
                            : "text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 md:mt-4">
            {completedCount} / {tasks.length} objetivos completos
          </p>
        </section>

        {/* 3. CLAIM REWARD */}
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