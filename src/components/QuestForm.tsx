import { useState } from "react";
import { type QuestRank } from "../config/gameConfig";

interface QuestFormProps {
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (title: string, rank: QuestRank) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: QuestFormProps) {
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState<QuestRank>("E");

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    await onSubmit(title.trim(), rank);
    
    // Reseta o formulário após o sucesso
    setTitle("");
    setRank("E");
    onClose();
  };

  // Mapeamento visual rápido para o seletor de Ranks (cores de texto internas)
  const rankColors: Record<QuestRank, string> = {
    E: "text-zinc-400",
    D: "text-emerald-400",
    C: "text-sky-400",
    B: "text-purple-400",
    A: "text-red-400",
    S: "text-amber-400 font-bold",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-200">
      {/* Container do Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Cabeçalho */}
        <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-sky-400/80">System Alert</p>
            <h3 className="text-base font-bold uppercase tracking-wider text-zinc-100">
              Register New Quest
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-mono uppercase tracking-widest"
          >
            [ Fechar ]
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          
          {/* Campo: Título da Quest */}
          <div>
            <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Mission Objective (Título)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treino de agilidade de 10km..."
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition-all font-sans"
              autoFocus
            />
          </div>

          {/* Campo: Rank de Dificuldade */}
          <div>
            <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Quest Difficulty Rank
            </label>
            <div className="relative">
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as QuestRank)}
                disabled={isSubmitting}
                className={`w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm outline-none focus:border-sky-500/60 transition-all font-mono uppercase tracking-widest ${rankColors[rank]}`}
              >
                <option value="E" className="text-zinc-400 bg-zinc-900">Rank E (Iniciante · +10 XP)</option>
                <option value="D" className="text-emerald-400 bg-zinc-900">Rank D (Fácil · +20 XP)</option>
                <option value="C" className="text-sky-400 bg-zinc-900">Rank C (Médio · +40 XP)</option>
                <option value="B" className="text-purple-400 bg-zinc-900">Rank B (Difícil · +80 XP)</option>
                <option value="A" className="text-red-400 bg-zinc-900">Rank A (Perigoso · +150 XP)</option>
                <option value="S" className="text-amber-400 bg-zinc-900 font-bold">Rank S (Monarca · +300 XP)</option>
              </select>
              {/* Seta customizada para o Select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Espaço reservado para Features Futuras (Subtarefas / IA) */}
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/20 p-3 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700 block">
              [+] Subtasks & AI Core Analysis (Locked)
            </span>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl border border-sky-400 bg-gradient-to-b from-sky-500/20 to-sky-500/5 px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-200 shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)] transition-all hover:from-sky-500/30 hover:to-sky-500/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
          >
            {isSubmitting ? "[ FIXANDO MISSÃO... ]" : "[ CONFIRMAR QUEST ]"}
          </button>
        </form>
      </div>
    </div>
  );
}