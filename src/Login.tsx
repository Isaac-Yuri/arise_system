import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Autenticação Real com Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/");
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      setErrorMsg(err.message || "Falha na autenticação do Hunter.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro ao autenticar com o Google:", err);
      setErrorMsg(err.message || "Erro ao conectar com o Google.");
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

      {/* Top-right link back home */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/"
          className="rounded-md border border-zinc-800 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 transition-colors hover:border-sky-500/40 hover:text-sky-400"
        >
          ← Voltar
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
              Acessar Conta
            </h1>
            <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              Autenticação de Hunter
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
              <label
                htmlFor="email"
                className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500"
              >
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
              <label
                htmlFor="password"
                className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-zinc-500"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              {isLoading ? "[ AUTENTICANDO... ]" : "[ ENTRAR ]"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              ou
            </span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-xs font-mono uppercase tracking-widest text-zinc-300 transition-all hover:border-zinc-700 hover:text-zinc-100 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>

          {/* Footer links */}
          <div className="mt-5 flex items-center justify-between">
            <Link
              to="/recuperar"
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 transition-colors hover:text-sky-400"
            >
              Esqueceu a senha?
            </Link>
            <Link
              to="/cadastro"
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 transition-colors hover:text-sky-400"
            >
              Criar conta
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