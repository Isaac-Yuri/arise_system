import { createBrowserRouter, RouterProvider } from 'react-router'
import Dashboard from './Dashboard'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}