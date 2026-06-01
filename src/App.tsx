import { createBrowserRouter, RouterProvider } from 'react-router'
import Dashboard from './Dashboard'
import Login from './login'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />, 
  },
  {
    path: "/login",
    element: <Login />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}