// src/layouts/AppLayout.tsx
import { Link, Outlet, useLocation } from "react-router";
import { supabase } from "../lib/supabase";

export default function AppLayout() {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Itens do menu compartilhados entre Desktop e Mobile
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "⚔️" },
    { path: "/loja", label: "Loja de Itens", icon: "🛒" },
    { path: "/perfil", label: "Status Perfil", icon: "👤" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-[#05060a] text-zinc-100 font-sans antialiased">
      
      {/* SIDEBAR (DESKTOP: Visível a partir de 'md') */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6">
        <div className="mb-8">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-sky-400/80">Sistema Arise</p>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mt-0.5">Painel da Guilda</h2>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                isActive(item.path)
                  ? "border-sky-400 bg-gradient-to-r from-sky-500/10 to-transparent text-sky-300 shadow-[0_0_15px_-5px_rgba(56,189,248,0.4)]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 font-mono text-xs uppercase tracking-widest text-zinc-600 transition-colors hover:border-red-500/30 hover:text-red-400"
        >
          <span>🚪</span>
          <span>Sair do Sistema</span>
        </button>
      </aside>

      {/* ÁREA DE CONTEÚDO (Garante espaçamento para não ficar embaixo dos menus fixos) */}
      <div className="flex-1 md:pl-64 pb-20 md:pb-0">
        <Outlet />
      </div>

      {/* BOTTOM NAVIGATION BAR (MOBILE: Visível abaixo de 'md') */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-900 bg-zinc-950/90 p-2 backdrop-blur-lg shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 font-mono text-[9px] uppercase tracking-wider transition-all ${
                isActive(item.path)
                  ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  : "text-zinc-600"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>

    </div>
  );
}