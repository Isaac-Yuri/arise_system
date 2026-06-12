import { supabase } from "../lib/supabase";

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
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md border border-sky-400/60 bg-sky-500/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-300 shadow-[0_0_15px_-5px_rgba(56,189,248,0.8)] md:text-xs md:px-3">
            LVL {String(player?.level || 1).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            title="Sair do sistema"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-500 transition-all hover:border-red-500/50 hover:text-red-400 active:scale-95"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
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