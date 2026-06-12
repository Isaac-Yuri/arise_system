import { toast } from "sonner";

export const notify = {
  success: (message: string) =>
    toast.success(message, { description: "Sistema Arise" }),

  error: (message: string) =>
    toast.error(message, { description: "Erro do Sistema" }),

  levelUp: (level: number) =>
    toast.success(`[ LEVEL UP · LVL ${String(level).padStart(2, "0")} ]`, {
      description: "Você ficou mais forte",
      duration: 5000,
    }),
};