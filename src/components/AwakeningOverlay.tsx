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
        "[AVISO DO SISTEMA: DETECTADO NOVO INDIVÍDUO APTO A SE TORNAR CAÇADOR.]",
        "[SISTEMA ARISE: ANALISANDO DNA DO CANDIDATO...]",
        "[O SISTEMA ARISE RECONHECEU SEU POTENCIAL COMO CAÇADOR.]",
        "[PROCESSO DE DESPERTAR CONCLUÍDO COM SUCESSO.]",
        "[ACEITA SEU CAMINHO DE EVOLUÇÃO?]"
    ];

    useEffect(() => {
        if (textIndex >= messages.length) {
            setIsTypingDone(true);
            return;
        }

        const fullText = messages[textIndex];
        setCurrentText("");

        // 1. Cria o loop para digitar o texto caractere por caractere
        const interval = setInterval(() => {
            setCurrentText((prev) => {
                if (prev.length < fullText.length) {
                    return prev + fullText[prev.length];
                }
                return prev;
            });
        }, 75);

        return () => clearInterval(interval);
    }, [textIndex]);

    useEffect(() => {
        if (textIndex >= messages.length) return;

        const fullText = messages[textIndex];

        if (currentText === fullText) {
            const timeout = setTimeout(() => {
                setTextIndex((prev) => prev + 1);
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [currentText, textIndex]);

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
            <div className="w-full max-w-xl rounded-xl border border-zinc-900 bg-zinc-950/80 p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] font-mono text-xs md:text-sm tracking-widest uppercase">

                {/* Caixa de Mensagem do Sistema - Centralizada e com alinhamento corrigido */}
                <div className="min-h-[80px] text-sky-400 leading-relaxed text-center flex items-center justify-center px-4">
                    <p>
                        {currentText}
                        {!isTypingDone && <span className="animate-pulse ml-1 font-bold text-sky-300">_</span>}
                    </p>
                </div>

                {/* Botão de Ação revelado no final */}
                <div className={`mt-8 border-t border-zinc-900/60 pt-6 transition-all duration-1000 ${isTypingDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    <p className="text-[10px] text-zinc-500 mb-5 text-center lowercase tracking-wide">
                        *ao aceitar, o painel de monitoramento de quests diárias será vinculado à sua alma.
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