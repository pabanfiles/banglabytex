import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Admin from './pages/admin/Admin'
import NotFound from './pages/NotFound'
import About from './pages/legal/About'
import Contact from './pages/legal/Contact'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import { tools } from './config/toolsRegistry'
import PageLoader from './components/PageLoader'

const toolRoutes = tools.map(tool => ({
  path: tool.slug,
  element: <Suspense fallback={<PageLoader />}><tool.component /></Suspense>,
}))

const router = createHashRouter([
  {
    path: '/', element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'admin', element: <Admin /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy-policy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      ...toolRoutes,
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function Router() { return <RouterProvider router={router} /> }