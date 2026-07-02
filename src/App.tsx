import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Loja from "./pages/Loja";
import { useAuth } from "./hooks/useAuth";

import AppLayout from "./layouts/AppLayout";

/** Bloqueia acesso a rotas privadas para usuários não autenticados. */
function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return !user ? <Outlet /> : <Navigate to="/" replace />;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060a] font-mono text-xs uppercase tracking-widest text-sky-400 animate-pulse">
      [ Autenticando com a Guilda... ]
    </div>
  );
}


const router = createBrowserRouter([
  {
    // Rotas privadas — exigem login
    element: <PrivateRoute />,
    children: [
      {
        // Inserimos o AppLayout envolvendo as páginas privadas
        element: <AppLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/loja", element: <Loja /> },
          { path: "/perfil", element: <div className="p-8 text-zinc-500 font-mono text-xs uppercase">[ Status do Hunter Indisponível ]</div> },
        ],
      },
    ],
  },
  {
    // Rotas públicas
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/cadastro", element: <Cadastro /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "!bg-zinc-900 !border !border-zinc-800 !text-zinc-100 !font-mono !text-xs !uppercase !tracking-widest !rounded-xl",
            error:
              "!border-red-500/40 !shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]",
            success:
              "!border-sky-500/40 !shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)]",
            description: "!text-zinc-500",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}