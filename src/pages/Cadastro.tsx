import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import GoogleLoginButton from "../components/GoogleLoginButton";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function Cadastro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Cria a conta do usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Metadados enviados para a Trigger automática do banco
          },
        },
      });

      if (error) throw error;

      // Cadastro bem-sucedido! Redireciona o novo Hunter para o Dashboard
      if (data?.user) {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Erro no registro do Hunter:", err);
      setErrorMsg(err.message || "Falha ao registrar novo Hunter.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-lg border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all";
  const inputIdle =
    "border-zinc-800 focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30";

  return (
    <main className="relative min-h-screen w-full bg-[#05060a] text-zinc-100 font-sans antialiased selection:bg-sky-500/40">
      {/* Ambient aura */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl md:h-96 md:w-96" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl md:h-96 md:w-96" />
      </div>

      {/* Top-right link back */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/login"
          className="rounded-md border border-zinc-800 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 transition-colors hover:border-sky-500/40 hover:text-sky-400"
        >
          ← Voltar para o Login
        </Link>
      </div>

      {/* Center card */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-10">
        <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur md:p-8">
          
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-sky-400/80">
              Sistema Arise
            </p>
            <h1 className="mt-1 text-lg font-bold uppercase tracking-wider text-zinc-50 sm:text-xl md:text-2xl">
              Criar Conta de Hunter
            </h1>
            <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              Desperte o seu verdadeiro potencial
            </p>
          </div>

          {/* Feedback de erro */}
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-[11px] text-red-400 text-center uppercase tracking-wider">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Nome do Hunter (Codinome)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sung Jin-Woo"
                required
                className={`${inputBase} ${inputIdle}`}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@guild.com"
                required
                className={`${inputBase} ${inputIdle}`}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className={`${inputBase} ${inputIdle}`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 w-full rounded-xl border px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 sm:text-sm ${
                isLoading
                  ? "cursor-wait border-zinc-800 bg-zinc-900/50 text-zinc-600"
                  : "border-sky-400 bg-gradient-to-b from-sky-500/20 to-sky-500/5 text-sky-200 shadow-[0_0_25px_-5px_rgba(56,189,248,0.9)] hover:from-sky-500/30 hover:to-sky-500/10 hover:shadow-[0_0_35px_-2px_rgba(56,189,248,1)] active:scale-[0.98]"
              }`}
            >
              {isLoading ? "[ ENVIANDO DADOS... ]" : "[ DESPERTAR CONTA ]"}
            </button>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">ou</span>
                <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <GoogleLoginButton onError={setErrorMsg} />
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center border-t border-zinc-800/60 pt-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              Já possui uma conta ativa?{" "}
            </span>
            <Link
              to="/login"
              className="text-[10px] font-mono uppercase tracking-widest text-sky-400 transition-colors hover:text-sky-300 ml-1"
            >
              Fazer Login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-700">
          Sistema Arise · v0.1
        </p>
      </div>
    </main>
  );
}