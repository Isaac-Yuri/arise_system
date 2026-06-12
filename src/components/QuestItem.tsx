import { useState } from "react";

interface DailyTask {
  id: string;
  title: string;
  is_completed: boolean;
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
      
      {/* 1. O clique de Concluir fica EXCLUSIVO no quadradinho do Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task.id, checked)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all disabled:opacity-50 ${
          checked
            ? "border-sky-400 bg-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
            : "border-zinc-600 hover:border-sky-500/60"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-sky-300" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5L13 5" />
          </svg>
        )}
      </button>

      {/* 2. O texto da tarefa (e input de edição) */}
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
          <span className={`block truncate text-sm leading-snug transition-all select-none ${checked ? "text-zinc-500 line-through opacity-60" : "text-zinc-200"}`}>
            {task.title}
          </span>
        )}
      </div>

      {/* 3. Painel de Ações: Sempre visível no Mobile, efeito Hover apenas no Desktop */}
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