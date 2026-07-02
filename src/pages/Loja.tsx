import { useState } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { notify } from "../lib/toast";
import { supabase } from "../lib/supabase";
import { GAME_CONFIG } from "../config/gameConfig";

interface ItemLoja {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: "real-world" | "system-buff";
  effectType?: "instant-xp" | "xp-boost";
  effectValue?: number;
}

export default function Loja() {
  const { player, setPlayer } = usePlayer();
  const [isBuying, setIsBuying] = useState<string | null>(null);

  // Vitrine personalizada unindo recompensas da Vida Real e buffs do Sistema
  const itensVitrine: ItemLoja[] = [
    /* ================= RECOMPENSAS MUNDO REAL ================= */
    {
      id: "real-entertainment",
      name: "Pergaminho do Entretenimento (2h)",
      description: "Concede o direito de assistir a filmes, séries ou jogar por 2 horas sem culpa no mundo real.",
      price: 20,
      icon: "📺",
      category: "real-world",
    },
    {
      id: "real-cheat-meal",
      name: "Banquete do Caçador (Cheat Meal)",
      description: "Libera uma refeição livre (Hambúrguer, Pizza, Doce) na sua dieta da vida real. Use com sabedoria.",
      price: 80,
      icon: "🍔",
      category: "real-world",
    },
    {
      id: "real-rest",
      name: "Pausa do Monarca (Dia de Descanso)",
      description: "Permissão para tirar um dia de folga total das suas metas diárias e recarregar suas energias.",
      price: 50,
      icon: "🛌",
      category: "real-world",
    },
    /* ================= ITENS DE SISTEMA ================= */
    {
      id: "potion-xp-100",
      name: "Elixir de Experiência Concentrado",
      description: "Item de sistema. Consome instantaneamente para injetar +100 XP diretamente nas suas veias de Hunter.",
      price: 40,
      icon: "🧪",
      category: "system-buff",
      effectType: "instant-xp",
      effectValue: 100,
    },
    {
      id: "monarch-ring",
      name: "Anel do Monarca",
      description: "Equipamento místico de sistema. Ativa permanentemente uma aura que aumenta a estética e respeito da guilda.",
      price: 250,
      icon: "💍",
      category: "system-buff",
    },
  ];

  const handleComprar = async (item: ItemLoja) => {
    if (!player) return;

    const saldoAtual = player.arise_coins ?? 0;

    if (saldoAtual < item.price) {
      notify.error(`[SISTEMA] Moedas insuficientes para adquirir ${item.name}.`);
      return;
    }

    try {
      setIsBuying(item.id);
      const novoSaldo = saldoAtual - item.price;

      // Valores padrões iniciais se o item não alterar os dados do jogo
      let finalXp = player.xp;
      let finalLevel = player.level;
      let finalRank = player.rank;

      // Se for um item de sistema que dá XP instantâneo
      if (item.category === "system-buff" && item.effectType === "instant-xp" && item.effectValue) {
        let rawXp = player.xp + item.effectValue;
        let leveledUp = false;

        // Processa possíveis múltiplos Level Ups
        while (rawXp >= GAME_CONFIG.xp.perLevel) {
          finalLevel += 1;
          rawXp = rawXp - GAME_CONFIG.xp.perLevel;
          leveledUp = true;
        }
        finalXp = rawXp;

        if (leveledUp) {
          notify.levelUp(finalLevel);
          const calculatedRank = GAME_CONFIG.playerRankByLevel(finalLevel);
          if (calculatedRank !== finalRank) finalRank = calculatedRank;
        }
      }

      // Atualiza o banco de dados (tabela 'users')
      const { error } = await supabase
        .from("users")
        .update({ 
          arise_coins: novoSaldo,
          xp: finalXp,
          level: finalLevel,
          rank: finalRank
        })
        .eq("id", player.id);

      if (error) throw error;

      // Atualiza o estado global no React
      setPlayer((prev) => (prev ? { 
        ...prev, 
        arise_coins: novoSaldo,
        xp: finalXp,
        level: finalLevel,
        rank: finalRank
      } : null));

      // Mensagem customizada dependendo do tipo de item comprado
      if (item.category === "real-world") {
        notify.success(`[RECOMPENSA LIBERADA] Você adquiriu o direito de: "${item.name}" no mundo real! Go ahead.`);
      } else if (item.effectType === "instant-xp") {
        notify.success(`[SISTEMA] Elixir Consumido! +${item.effectValue} XP adicionado.`);
      } else {
        notify.success(`[COMPRA CONCLUÍDA] ${item.name} adquirido!`);
      }

    } catch (err) {
      console.error(err);
      notify.error("Falha ao processar transação.");
    } finally {
      setIsBuying(null);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#05060a] text-zinc-100 font-sans antialiased p-4 sm:p-6 md:p-8 lg:p-10">
      
      {/* Header da Página */}
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-400">
          Mercado Dimensional
        </p>
        <h1 className="mt-1 text-xl font-bold uppercase tracking-wider text-zinc-50 sm:text-2xl">
          Loja do Sistema Arise
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Gaste suas Arise Coins para comprar buffs digitais ou desbloquear desejos no mundo real
        </p>
      </div>

      {/* Seção 1: Itens do Mundo Real */}
      <section className="mb-10">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-400 flex items-center gap-2">
          <span>🌍</span> Recompensas do Mundo Real <span className="text-[10px] text-zinc-600 font-normal">(Compre para usufruir na rotina)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itensVitrine.filter(i => i.category === "real-world").map((item) => {
            const naoTemSaldo = (player?.arise_coins ?? 0) < item.price;
            return (
              <div key={item.id} className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-all hover:border-zinc-700">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">{item.icon}</span>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded">🪙 {item.price} AC</span>
                  </div>
                  <h3 className="mt-3 font-mono text-sm font-bold uppercase tracking-wide text-zinc-200">{item.name}</h3>
                  <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleComprar(item)}
                  disabled={isBuying !== null}
                  className={`mt-4 w-full rounded-lg border py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                    naoTemSaldo ? "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed" : "border-zinc-700 hover:border-amber-500/50 hover:text-amber-300"
                  }`}
                >
                  {isBuying === item.id ? "Comprando..." : "Desbloquear Recompensa"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seção 2: Buffs do Sistema */}
      <section>
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-purple-400 flex items-center gap-2">
          <span>⚡</span> Itens & Buffs do Sistema <span className="text-[10px] text-zinc-600 font-normal">(Efeitos aplicados direto no app)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itensVitrine.filter(i => i.category === "system-buff").map((item) => {
            const naoTemSaldo = (player?.arise_coins ?? 0) < item.price;
            return (
              <div key={item.id} className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-all hover:border-purple-500/20 hover:shadow-[0_0_15px_-5px_rgba(168,85,247,0.15)]">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">{item.icon}</span>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded">🪙 {item.price} AC</span>
                  </div>
                  <h3 className="mt-3 font-mono text-sm font-bold uppercase tracking-wide text-zinc-200">{item.name}</h3>
                  <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleComprar(item)}
                  disabled={isBuying !== null}
                  className={`mt-4 w-full rounded-lg border py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                    naoTemSaldo ? "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed" : "border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
                  }`}
                >
                  {isBuying === item.id ? "Consumindo..." : "Utilizar Item de Sistema"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}