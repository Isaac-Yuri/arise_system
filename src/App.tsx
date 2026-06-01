import { createBrowserRouter, RouterProvider } from 'react-router'
import Dashboard from './Dashboard'
import Login from './Login'
import Cadastro from './Cadastro'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />, 
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  }
])

export default function App() {
  return <RouterProvider router={router} />
}