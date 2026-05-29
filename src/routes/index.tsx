import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sistema Arise — Solo Leveling Productivity" },
      { name: "description", content: "Suba de nível na vida real. Sistema de produtividade gamificado inspirado em Solo Leveling." },
      { property: "og:title", content: "Sistema Arise" },
      { property: "og:description", content: "Suba de nível na vida real." },
    ],
  }),
  component: Index,
});

const INITIAL_QUESTS = [
  "Concluir o treino de Calistenia (Mínimo 20 min)",
  "Estudar Tecnologia / Faculdade de ADS (Mínimo 1h)",
  "Realizar aporte no caixa do Casamento / Moto",
];

function Index() {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [xp, setXp] = useState(0);
  const [claimed, setClaimed] = useState(false);

  const allDone = done.every(Boolean);
  const completedCount = useMemo(() => done.filter(Boolean).length, [done]);
  const xpPct = Math.min(100, (xp / 100) * 100);

  const toggle = (i: number) => {
    if (claimed) return;
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const claim = () => {
    if (!allDone || claimed) return;
    setXp((x) => Math.min(100, x + 25));
    setClaimed(true);
    setTimeout(() => {
      setDone([false, false, false]);
      setClaimed(false);
    }, 1200);
  };

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
                ISAAC YURI
              </h1>
            </div>
            <span className="shrink-0 rounded-md border border-sky-400/60 bg-sky-500/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-300 shadow-[0_0_15px_-5px_rgba(56,189,248,0.8)] md:text-xs md:px-3">
              LVL 01
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
              XP: {xp} / 100
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

          <ul className="flex flex-col gap-2.5 md:gap-3">
            {INITIAL_QUESTS.map((quest, i) => {
              const checked = done[i];
              return (
                <li key={i}>
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
                      onChange={() => toggle(i)}
                      className="sr-only"
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
                      {quest}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 md:mt-4">
            {completedCount} / {INITIAL_QUESTS.length} objetivos completos
          </p>
        </section>

        {/* 3. CLAIM REWARD */}
        <button
          type="button"
          onClick={claim}
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
