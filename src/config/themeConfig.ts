import { type QuestRank } from "./gameConfig";

export interface HunterTheme {
  auraTop: string;
  auraBottom: string;
  highlightText: string;
  panelBorder: string;
  xpBar: string;
}

export const HUNTER_THEME_STYLES: Record<QuestRank, HunterTheme> = {
  E: {
    auraTop: "bg-zinc-500/10 h-72 w-72 md:h-96 md:w-96",
    auraBottom: "bg-zinc-700/5 h-72 w-72",
    highlightText: "text-zinc-400/80",
    panelBorder: "border-zinc-800",
    xpBar: "from-sky-500 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.9)]",
  },
  D: {
    auraTop: "bg-emerald-500/10 h-72 w-72 md:h-96 md:w-96",
    auraBottom: "bg-emerald-700/5 h-72 w-72",
    highlightText: "text-emerald-400/80",
    panelBorder: "border-emerald-950/60",
    xpBar: "from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]",
  },
  C: {
    auraTop: "bg-sky-500/10 h-72 w-72 md:h-96 md:w-96",
    auraBottom: "bg-indigo-500/10 h-72 w-72",
    highlightText: "text-sky-400/80",
    panelBorder: "border-sky-950/60",
    xpBar: "from-sky-500 to-indigo-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]",
  },
  B: {
    auraTop: "bg-purple-500/15 h-80 w-80 md:h-[400px] md:w-[400px]",
    auraBottom: "bg-fuchsia-500/10 h-80 w-80",
    highlightText: "text-purple-400/80",
    panelBorder: "border-purple-950/60",
    xpBar: "from-purple-500 to-fuchsia-400 shadow-[0_0_10px_rgba(168,85,247,0.9)]",
  },
  A: {
    auraTop: "bg-red-500/15 h-96 w-96 md:h-[450px] md:w-[450px]",
    auraBottom: "bg-rose-600/10 h-96 w-96",
    highlightText: "text-red-400/80",
    panelBorder: "border-red-950/40",
    xpBar: "from-red-600 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.9)]",
  },
  S: {
    auraTop: "bg-amber-500/20 h-[400px] w-[400px] md:h-[500px] md:w-[500px] animate-pulse duration-[4000ms]",
    auraBottom: "bg-yellow-600/15 h-[400px] w-[400px] animate-pulse duration-[3000ms]",
    highlightText: "text-amber-400 font-bold tracking-[0.4em] shadow-[0_0_10px_rgba(251,191,36,0.2)]",
    panelBorder: "border-amber-500/20",
    xpBar: "from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_20px_rgba(251,191,36,1)]",
  },
};