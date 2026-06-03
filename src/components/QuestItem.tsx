import { useState } from "react";

interface DailyTask {
  id: string;
  title: string;
  is_completed: boolean;
}

interface QuestItemProps {
  task: DailyTask;
  claimed: boolean;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, newTitle: string) => Promise<void>;
}

export function QuestItem({ task, claimed, onToggle, onDelete, onUpdateText }: QuestItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);

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

  const checked = task.is_completed;

  return (
    <li className="group relative flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 transition-all hover:border-zinc-700 md:px-4">
      {/* Clique no corpo da tarefa apenas alterna se NÃO estiver editando */}
      <div 
        onClick={() => !isEditing && onToggle(task.id, checked)}
        className={`flex flex-1 cursor-pointer items-start gap-3 ${claimed ? "pointer-events-none" : ""}`}
      >
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
            checked
              ? "border-sky-400 bg-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
              : "border-zinc-600 group-hover:border-sky-500/60"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-sky-300" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5L13 5" />
            </svg>
          )}
        </span>

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            disabled={isSaving}
            className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-sm text-zinc-100 outline-none focus:border-sky-500"
            autoFocus
          />
        ) : (
          <span className={`text-sm leading-snug transition-all select-none ${checked ? "text-zinc-500 line-through opacity-60" : "text-zinc-200"}`}>
            {task.title}
          </span>
        )}
      </div>

      {/* Painel de Ações (Editar / Deletar) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1 text-emerald-400 hover:text-emerald-300"
            title="Salvar alteração"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-zinc-500 hover:text-sky-400 transition-colors"
            title="Editar quest"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
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