import { useState } from "react";
import { supabase } from "../lib/supabase";
import { notify } from "../lib/toast";

interface InventoryItem {
  id: string;
  item_id: string;
  quantity: number;
}

export function useInventory(userId: string | undefined) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loadingInv, setLoadingInv] = useState(false);

  const fetchInventory = async () => {
    if (!userId) return;
    try {
      setLoadingInv(true);
      const { data, error } = await supabase
        .from("inventario")
        .select("id, item_id, quantity")
        .eq("user_id", userId);

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error("Erro ao carregar inventário:", err);
    } finally {
      setLoadingInv(false);
    }
  };

  const addItemToInventory = async (itemId: string) => {
    if (!userId) return;
    try {
      // Tenta inserir; se já existir o item_id para este usuário, incrementa a quantidade (Upsert manual ou via RPC)
      const existing = inventory.find(i => i.item_id === itemId);
      
      if (existing) {
        const { error } = await supabase
          .from("inventario")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("inventario")
          .insert([{ user_id: userId, item_id: itemId, quantity: 1 }]);
        if (error) throw error;
      }
      await fetchInventory(); // Recarrega a UI
    } catch (err) {
      console.error("Erro ao adicionar ao inventário:", err);
    }
  };

  const consumeItem = async (itemId: string): Promise<boolean> => {
    if (!userId) return false;
    const target = inventory.find(i => i.item_id === itemId);
    if (!target || target.quantity <= 0) {
      notify.error("Você não possui este item.");
      return false;
    }

    try {
      if (target.quantity === 1) {
        const { error } = await supabase.from("inventario").delete().eq("id", target.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("inventario")
          .update({ quantity: target.quantity - 1 })
          .eq("id", target.id);
        if (error) throw error;
      }
      
      setInventory(prev =>
        prev
          .map(i => (i.item_id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
          .filter(i => i.quantity > 0)
      );
      return true;
    } catch (err) {
      console.error("Erro ao consumir item:", err);
      notify.error("Falha ao consumir item no servidor.");
      return false;
    }
  };

  return { inventory, loadingInv, fetchInventory, addItemToInventory, consumeItem };
}