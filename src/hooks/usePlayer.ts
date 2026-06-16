import { useState } from "react";
import { supabase } from "../lib/supabase";
import { type UserData } from "../types";

export function usePlayer() {
  const [player, setPlayer] = useState<UserData | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState(true);

  const fetchPlayer = async (userId: string) => {
    try {
      setLoadingPlayer(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        // Fallback de contingência caso a trigger demore a responder
        setPlayer({ id: userId, name: "MONARCA ADORMECIDO", level: 1, xp: 0, rank: "E" });
      } else {
        setPlayer(data[0]);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do caçador:", err);
      throw err;
    } finally {
      setLoadingPlayer(false);
    }
  };

  return { player, setPlayer, loadingPlayer, fetchPlayer };
}