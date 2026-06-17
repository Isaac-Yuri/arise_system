import { useState, useEffect } from "react";

interface AwakeningOverlayProps {
  onConfirm: () => Promise<void>;
}

export function AwakeningOverlay({ onConfirm }: AwakeningOverlayProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messages = [
    "[AVISO DO SISTEMA: DETECTADO NOVO INDIVÍDUO NA ÁREA DE VARREDURA]",
    "[AVALIANDO PHANTOM MANA DO CANDIDATO...]",
    "[PROCESSO DE DESPERTAR CONCLUÍDO COM SUCESSO.]",
    "[VOCÊ FOI CADASTRADO COMO UM CAÇADOR DA ASSOCIAÇÃO.]"
  ];

  useEffect(() => {
    if (textIndex >= messages.length) {
      setIsTypingDone(true);
      return;
    }

    let charIndex = 0;
    const fullText = messages[textIndex];
    setCurrentText("");

    const interval = setInterval(() => {
      setCurrentText((prev) => prev + fullText[charIndex]);
      charIndex++;

      if (charIndex >= fullText.length) {
        clearInterval(interval);
        // Pequena pausa antes de passar para a próxima frase automática
        setTimeout(() => {
          setTextIndex((prev) => prev + 1);
        }, 1200);
      }
    }, 40); // Velocidade da digitação por caractere

    return () => clearInterval(interval);
  }, [textIndex]);

  const handleAwaken = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 select-none animate-in fade-in duration-700">
      <div className="w-full max-w-lg rounded-xl border border-zinc-900 bg-zinc-950/80 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] font-mono text-xs md:text-sm tracking-widest uppercase">
        
        {/* Caixa de Mensagem do Sistema */}
        <div className="min-h-[100px] text-sky-400 leading-relaxed">
          {currentText}
          {!isTypingDone && <span className="animate-pulse ml-1">_</span>}
        </div>

        {/* Botão de Ação revelado no final */}
        <div className={`mt-8 border-t border-zinc-900 pt-6 transition-all duration-1000 ${isTypingDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          <p className="text-[10px] text-zinc-500 mb-4 text-center">
            *Ao aceitar, o painel de monitoramento de quests diárias será vinculado à sua alma.
          </p>
          <button
            type="button"
            onClick={handleAwaken}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-sky-400 bg-gradient-to-b from-sky-500/20 to-sky-500/5 px-4 py-4 font-bold text-sky-200 tracking-[0.25em] shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:from-sky-500/30 hover:to-sky-500/10 hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? "[ PROCESSANDO MANA... ]" : "[ ACEITAR DESPERTAR ]"}
          </button>
        </div>

      </div>
    </div>
  );
}