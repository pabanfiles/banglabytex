import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import AdminPanel from './pages/admin/AdminPanel'
import NotFound from './pages/NotFound'
import About from './pages/legal/About'
import Contact from './pages/legal/Contact'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import Blog from './pages/Blog'
import SinglePost from './pages/Blog/SinglePost'
import { tools } from './config/toolsRegistry'
import PageLoader from './components/PageLoader'

const toolRoutes = tools.map(tool => ({
  path: tool.slug,
  element: <Suspense fallback={<PageLoader />}><tool.component /></Suspense>,
}))

const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <SinglePost /> },
      { path: 'hellowsaipatit', element: <AdminPanel /> },
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