import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { createClient, type User } from "@supabase/supabase-js";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. verifica se já existe um usuário logado assim que o app abre
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 2. fica escutando mudanças no estado de auth (Login, Logout, Cadastro)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // tela de carregamento enquanto o Supabase checa os cookies de sessão
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060a] font-mono text-xs uppercase tracking-widest text-sky-400 animate-pulse">
        [ Autenticando com a Guilda... ]
      </div>
    );
  }

  // 3. definição das Rotas com as travas de segurança
  const router = createBrowserRouter([
    {
      path: "/",
      // se tiver user, vai pro Dashboard. Se não, manda para o /login
      element: user ? <Dashboard /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      // se JÁ estiver logado, não faz sentido ver o login, manda direto para a raiz "/"
      element: !user ? <Login /> : <Navigate to="/" replace />,
    },
    {
      path: "/cadastro",
      // se JÁ estiver logado, impede de criar outra conta agora, manda para a raiz "/"
      element: !user ? <Cadastro /> : <Navigate to="/" replace />,
    },
    {
      path: "*",
      // rota coringa para caminhos inexistentes: manda para a raiz
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}