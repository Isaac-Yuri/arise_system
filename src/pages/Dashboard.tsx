import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";

import { ProfileHeader } from "../components/ProfileHeader";
import { QuestForm } from "../components/QuestForm";
import { QuestItem } from "../components/QuestItem";
import { AwakeningOverlay } from "../components/AwakeningOverlay";
import { notify } from "../lib/toast";
import { GAME_CONFIG, type QuestRank } from "../config/gameConfig";
import { HUNTER_THEME_STYLES } from "../config/themeConfig";
import { usePlayer } from "../hooks/usePlayer";
import { useQuests } from "../hooks/useQuests";

export default function Dashboard() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { player, setPlayer, loadingPlayer, fetchPlayer, awakenPlayer } = usePlayer();
  const { tasks, loadingTasks, isSubmittingTask, fetchTasks, createTask, toggleTask, updateTaskText, deleteTask } = useQuests(player, setPlayer);

  const currentRank: QuestRank = player?.rank || "E";
  const theme = HUNTER_THEME_STYLES[currentRank];

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Executa as buscas em paralelo para otimização de performance
        await Promise.all([
          fetchPlayer(user.id),
          fetchTasks(user.id)
        ]);
      } catch (err) {
        notify.error("Erro ao carregar dados do sistema Arise");
      }
    }
    loadDashboardData();
  }, []);

  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const xpPct = player ? Math.min(100, (player.xp / GAME_CONFIG.xp.perLevel) * 100) : 0;

  if (loadingPlayer || loadingTasks) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060a] font-mono text-xs uppercase tracking-widest text-sky-400 animate-pulse">
        [ Sincronizando com o Sistema... ]
      </div>
    );
  }

  if (player && !player.has_awakened) {
    return <AwakeningOverlay onConfirm={() => awakenPlayer(player.id)} />;
  }

  return (
    <main className="min-h-screen w-full bg-[#05060a] text-zinc-100 font-sans antialiased selection:bg-sky-500/40">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 rounded-full blur-3xl transition-all duration-1000 ease-in-out ${theme.auraTop}`} />
        <div className={`absolute bottom-0 right-0 rounded-full blur-3xl transition-all duration-1000 ease-in-out ${theme.auraBottom}`} />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:max-w-xl md:gap-6 md:px-8 md:py-10 lg:max-w-2xl lg:px-10 lg:py-12">

        <ProfileHeader
          player={player}
          xpPct={xpPct}
          xpMax={GAME_CONFIG.xp.perLevel}
          xpBarClass={theme.xpBar}
        />

        <section className={`flex-1 rounded-xl border bg-zinc-900/80 p-4 backdrop-blur transition-all duration-1000 ease-in-out md:p-5 lg:p-6 ${theme.panelBorder}`}>
          <div className="mb-4 border-b border-zinc-800 pb-2.5 flex items-center justify-between">
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-[0.3em] transition-all duration-1000 ${theme.highlightText}`}>
                Daily Quest
              </p>
              <h2 className="mt-1 text-sm font-bold uppercase tracking-wide text-zinc-100 sm:text-base md:text-lg">
                Prepare to Get Stronger
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingTask(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200 active:scale-95"
              title="Adicionar Nova Missão Diária"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          <QuestForm
            isOpen={isAddingTask}
            onClose={() => setIsAddingTask(false)}
            onSubmit={createTask}
            isSubmitting={isSubmittingTask}
          />

          {tasks.length === 0 ? (
            <p className="text-center py-6 font-mono text-xs text-zinc-600 uppercase tracking-wider">
              Nenhuma quest activa no painel.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 md:gap-3">
              {tasks.map((task) => (
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