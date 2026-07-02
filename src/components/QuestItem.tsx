import { useState } from "react";
import { type QuestRank, GAME_CONFIG } from "../config/gameConfig";

interface DailyTask {
  id: string;
  title: string;
  is_completed: boolean;
  difficulty_rank?: QuestRank; 
}

interface QuestItemProps {
  task: DailyTask;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, newTitle: string) => Promise<void>;
}

export function QuestItem({ task, onToggle, onDelete, onUpdateText }: QuestItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);

  const checked = task.is_completed;
  const rank: QuestRank = task.difficulty_rank || "E"; // Fallback caso seja uma tarefa antiga sem rank
  const xpReward = GAME_CONFIG.xp.byRank[rank];
  
  // PUXA A RECOMPENSA DE COINS DIRETAMENTE DO GAME_CONFIG
  const coinReward = (GAME_CONFIG as any).coins?.byRank?.[rank] || 2;

  // Configuração de estilos visuais dinâmicos baseados no Rank da Missão
  const rankStyles: Record<QuestRank, { border: string; text: string; bg: string; shadow: string; badge: string }> = {
    E: {
      border: "border-zinc-800 hover:border-zinc-700",
      text: "text-zinc-200",
      bg: "bg-zinc-950/40",
      shadow: "",
      badge: "border-zinc-700 bg-zinc-900/50 text-zinc-400",
    },
    D: {
      border: "border-emerald-950 hover:border-emerald-800/60",
      text: "text-emerald-100",
      bg: "bg-emerald-950/10",
      shadow: "shadow-[0_0_15px_-5px_rgba(52,211,153,0.1)]",
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    C: {
      border: "border-sky-950 hover:border-sky-800/60",
      text: "text-sky-100",
      bg: "bg-sky-950/10",
      shadow: "shadow-[0_0_15px_-5px_rgba(56,189,248,0.15)]",
      badge: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    },
    B: {
      border: "border-purple-950 hover:border-purple-800/60",
      text: "text-purple-100",
      bg: "bg-purple-950/10",
      shadow: "shadow-[0_0_20px_-5px_rgba(192,132,252,0.2)]",
      badge: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    },
    A: {
      border: "border-red-950/60 hover:border-red-800/60",
      text: "text-red-100",
      bg: "bg-red-950/10",
      shadow: "shadow-[0_0_25px_-5px_rgba(248,113,113,0.25)]",
      badge: "border-red-500/30 bg-red-500/10 text-red-400 font-medium",
    },
    S: {
      border: "border-amber-500/40 hover:border-amber-400/60 animate-pulse",
      text: "text-amber-100 font-semibold tracking-wide",
      bg: "bg-amber-950/10",
      shadow: "shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)]",
      badge: "border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]",
    },
  };

  const currentStyle = rankStyles[rank];

  const handleSave = async () => {
    if (!editText.trim() || editText.trim() === task.title) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    await onUpdateText(task.id, editText.trim());
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <li
      className={`group relative flex items-center gap-3 rounded-lg border px-3 py-3 transition-all md:px-4 ${
        checked 
          ? "border-zinc-900 bg-zinc-950/20 shadow-none opacity-50" 
          : `${currentStyle.border} ${currentStyle.bg} ${currentStyle.shadow}`
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task.id, checked)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all disabled:opacity-50 ${
          checked
            ? "border-sky-500 bg-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
            : "border-zinc-600 hover:border-sky-500/60"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-sky-300" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5L13 5" />
          </svg>
        )}
      </button>

      {/* Título e Badge de Recompensa */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            disabled={isSaving}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-sm text-zinc-100 outline-none focus:border-sky-500"
            autoFocus
          />
        ) : (
          <div className="flex flex-col gap-1">
            <span className={`block truncate text-sm leading-snug transition-all select-none ${checked ? "text-zinc-500 line-through" : currentStyle.text}`}>
              {task.title}
            </span>
            {/* O Badge com o Rank e as recompensas de XP e Arise Coins */}
            <div className="flex items-center">
              <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest border flex items-center gap-1 ${checked ? "border-zinc-800 bg-zinc-950 text-zinc-600" : currentStyle.badge}`}>
                <span>Rank {rank}</span>
                <span>·</span>
                <span>+{xpReward} XP</span>
                <span>·</span>
                <span className={checked ? "text-zinc-600" : "text-amber-400 font-bold"}>🪙 +{coinReward} AC</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Painel de Ações */}
      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 text-emerald-400 hover:text-emerald-300 active:scale-90"
            title="Salvar alteração"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-zinc-500 hover:text-sky-400 active:scale-90 transition-colors"
            title="Editar quest"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-zinc-500 hover:text-red-400 active:scale-90 transition-colors"
          title="Abandonar quest"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}