import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { type User } from "@supabase/supabase-js";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import { supabase } from "./lib/supabase";
import { Toaster } from "sonner";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const router = useMemo(() => createBrowserRouter([
    {
      path: "/",
      element: user ? <Dashboard /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: !user ? <Login /> : <Navigate to="/" replace />,
    },
    {
      path: "/cadastro",
      element: !user ? <Cadastro /> : <Navigate to="/" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]), [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060a] font-mono text-xs uppercase tracking-widest text-sky-400 animate-pulse">
        [ Autenticando com a Guilda... ]
      </div>
    );
  }

  <>
    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "!bg-zinc-900 !border !border-zinc-800 !text-zinc-100 !font-mono !text-xs !uppercase !tracking-widest !rounded-xl",
          error: "!border-red-500/40 !shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]",
          success: "!border-sky-500/40 !shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)]",
          description: "!text-zinc-500",
        },
      }}
    />
    <RouterProvider router={router} />
  </>

  return <RouterProvider router={router} />;
}