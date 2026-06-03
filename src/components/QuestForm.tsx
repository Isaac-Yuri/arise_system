interface QuestFormProps {
  isAddingTask: boolean;
  newTaskTitle: string;
  isSubmittingTask: boolean;
  setNewTaskTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function QuestForm({
  isAddingTask,
  newTaskTitle,
  isSubmittingTask,
  setNewTaskTitle,
  onSubmit,
}: QuestFormProps) {
  if (!isAddingTask) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200 flex gap-2"
    >
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
  );
}