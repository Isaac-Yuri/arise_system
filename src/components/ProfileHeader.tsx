interface UserData {
  name: string;
  level: number;
  xp: number;
}

interface ProfileHeaderProps {
  player: UserData | null;
  xpPct: number;
}

export function ProfileHeader({ player, xpPct }: ProfileHeaderProps) {
  return (
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
  );
}