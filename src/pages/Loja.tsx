import { useState, useEffect } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { useInventory } from "../hooks/useInventory";
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
  effectType?: "instant-xp" | "double-xp" | "real-permission";
  effectValue?: number;
}

// Catálogo Centralizado de Itens
export const CATALOGO_ITENS: ItemLoja[] = [
  {
    id: "real-entertainment",
    name: "Pergaminho de Lazer (2h)",
    description: "Desbloqueia o direito de assistir séries ou jogar por 2 horas no mundo real sem culpa.",
    price: 20,
    icon: "📺",
    category: "real-world",
    effectType: "real-permission"
  },
  {
    id: "potion-double-xp",
    name: "Elixir de Dupla Experiência (1h)",
    description: "Item de Sistema. Dobra todo o XP ganho ao concluir suas Quests Diárias pelos próximos 60 minutos.",
    price: 60,
    icon: "🧪",
    category: "system-buff",
    effectType: "double-xp"
  },
  {
    id: "potion-xp-100",
    name: "Elixir de XP Direto",
    description: "Item de Sistema. injeta +100 XP diretamente na sua barra de nível atual.",
    price: 40,
    icon: "🧪",
    category: "system-buff",
    effectType: "instant-xp",
    effectValue: 100
  },
  {
    id: "real-cheat-meal",
    name: "Banquete do Caçador",
    description: "Libera o direito de comer uma refeição livre (hambúrguer/pizza) na sua rotina real.",
    price: 80,
    icon: "🍔",
    category: "real-world",
    effectType: "real-permission"
  }
];

export default function Loja() {
  const { player, setPlayer, fetchPlayer} = usePlayer();
  const { inventory, fetchInventory, addItemToInventory, consumeItem } = useInventory(player?.id);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Insira este useEffect junto ao outro existente em Loja.tsx:
  useEffect(() => {
    async function sincronizarSistema() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && fetchPlayer) {
        await fetchPlayer(user.id); // Força o app a puxar as Arise Coins atualizadas do banco
      }
    }
    sincronizarSistema();
  }, []);

  useEffect(() => {
    if (player?.id) fetchInventory();
  }, [player?.id]);

  const handleComprar = async (item: ItemLoja) => {
    if (!player) return;
    const saldoAtual = player.arise_coins ?? 0;

    if (saldoAtual < item.price) {
      notify.error(`Moedas insuficientes para adquirir ${item.name}.`);
      return;
    }

    try {
      setIsProcessing(`buy-${item.id}`);
      const novoSaldo = saldoAtual - item.price;

      // Desconta moedas no banco
      const { error } = await supabase.from("users").update({ arise_coins: novoSaldo }).eq("id", player.id);
      if (error) throw error;

      // Adiciona o item ao Inventário do Banco de Dados
      await addItemToInventory(item.id);

      // Atualiza estado local
      setPlayer((prev) => (prev ? { ...prev, arise_coins: novoSaldo } : null));
      notify.success(`[COMPRA CONCLUÍDA] ${item.name} enviado para o seu inventário!`);
    } catch (err) {
      console.error(err);
      notify.error("Erro ao processar transação.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleAtivarItem = async (itemId: string) => {
    const itemInfo = CATALOGO_ITENS.find(i => i.id === itemId);
    if (!itemInfo || !player) return;

    setIsProcessing(`use-${itemId}`);
    const sucesso = await consumeItem(itemId);

    if (sucesso) {
      if (itemInfo.effectType === "instant-xp" && itemInfo.effectValue) {
        // Lógica de XP instantâneo que já tínhamos estruturado
        let rawXp = player.xp + itemInfo.effectValue;
        let finalLevel = player.level;
        let finalRank = player.rank;
        let leveledUp = false;

        while (rawXp >= GAME_CONFIG.xp.perLevel) {
          finalLevel += 1;
          rawXp -= GAME_CONFIG.xp.perLevel;
          leveledUp = true;
        }
        if (leveledUp) {
          notify.levelUp(finalLevel);
          finalRank = GAME_CONFIG.playerRankByLevel(finalLevel);
        }

        await supabase.from("users").update({ xp: rawXp, level: finalLevel, rank: finalRank }).eq("id", player.id);
        setPlayer(prev => prev ? { ...prev, xp: rawXp, level: finalLevel, rank: finalRank } : null);
        notify.success(`[SISTEMA] Elixir consumido. +${itemInfo.effectValue} de XP obtido!`);
      } 
      
      else if (itemInfo.effectType === "double-xp") {
        // Para o Double XP, podemos salvar o timestamp de quando expira no LocalStorage (simples e funcional)
        const duracao = Date.now() + 60 * 60 * 1000; // 1 hora a partir de agora
        localStorage.setItem("arise_xp_boost_until", duracao.toString());
        notify.success(`[BUFF ATIVADO] Efeito Double XP ativo pelos próximos 60 minutos! ⚡`);
      } 
      
      else if (itemInfo.effectType === "real-permission") {
        notify.success(`[MUNDO REAL] Ativado! Você tem o direito legítimo de usar: "${itemInfo.name}". Aproveite sem culpa!`);
      }
    }
    setIsProcessing(null);
  };

  return (
    <main className="min-h-screen w-full bg-[#05060a] text-zinc-100 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-400">Mercado Dimensional</p>
        <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-50">Loja & Inventário do Sistema</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Vitrine de Vendas */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-sky-400">🛒 Catálogo de Itens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CATALOGO_ITENS.map((item) => {
              // Garante que se o player ainda estiver carregando, não quebre e trate como 0 coins
              const moedasAtuais = player?.arise_coins ?? 0;
              const naoTemSaldo = moedasAtuais < item.price;
              
              // O botão só deve ser desativado rigidamente se realmete NÃO tiver saldo E o player já tiver sido carregado
              const botaoDesabilitado = !player || naoTemSaldo || isProcessing !== null;

              return (
                <div key={item.id} className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-2xl bg-zinc-950 p-2 rounded-lg border border-zinc-800">{item.icon}</span>
                      <span className="font-mono text-xs font-bold text-amber-400">🪙 {item.price} AC</span>
                    </div>
                    <h3 className="mt-3 font-mono text-sm font-bold text-zinc-200">{item.name}</h3>
                    <p className="mt-1 text-xs text-zinc-400 font-sans">{item.description}</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleComprar(item)}
                    disabled={botaoDesabilitado}
                    className={`mt-4 w-full rounded-lg border py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                      !player 
                        ? "border-zinc-800 bg-zinc-950/20 text-zinc-600 cursor-wait"
                        : naoTemSaldo 
                          ? "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed" 
                          : "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 shadow-[0_0_15px_-5px_rgba(251,191,36,0.2)] active:scale-[0.98]"
                    }`}
                  >
                    {!player 
                      ? "[ SINCRONIZANDO... ]" 
                      : isProcessing === `buy-${item.id}` 
                        ? "[ FORJANDO TRANSAÇÃO... ]" 
                        : "[ ADQUIRIR ITEM ]"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Lateral do Inventário */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 backdrop-blur-sm h-fit">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
            🎒 Seu Inventário ({inventory.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>

          {inventory.length === 0 ? (
            <p className="text-center font-mono text-xs text-zinc-600 py-6 uppercase tracking-wider">[ Seu inventário está vazio ]</p>
          ) : (
            <div className="flex flex-col gap-2">
              {inventory.map((inv) => {
                const itemInfo = CATALOGO_ITENS.find(i => i.id === inv.item_id);
                if (!itemInfo) return null;
                return (
                  <div key={inv.id} className="flex items-center justify-between border border-zinc-800 bg-zinc-900/20 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{itemInfo.icon}</span>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-bold text-zinc-200 truncate">{itemInfo.name}</p>
                        <p className="text-[10px] text-purple-400 font-mono">Qtd: {inv.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAtivarItem(inv.item_id)}
                      disabled={isProcessing !== null}
                      className="shrink-0 bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-md transition-all active:scale-95"
                    >
                      {isProcessing === `use-${inv.item_id}` ? "..." : "Usar"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}