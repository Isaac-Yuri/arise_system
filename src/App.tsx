import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { type User } from "@supabase/supabase-js";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import { supabase } from "./lib/supabase";

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

  return <RouterProvider router={router} />;
}