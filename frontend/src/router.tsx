import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import AdminPanel from './pages/admin/AdminPanel'
import NotFound from './pages/NotFound'
import Blog from './pages/Blog'
import SinglePost from './pages/Blog/SinglePost'
import AgeCalc from './pages/tools/AgeCalc'
import PercentageCalc from './pages/tools/PercentageCalc'
import QrCodeGen from './pages/tools/QrCodeGen'
import CvMaker from './pages/tools/CvMaker'
import VideoDownloader from './pages/tools/VideoDownloader'
import PdfMerge from './pages/tools/PdfMerge'
import PdfSplit from './pages/tools/PdfSplit'
import PdfCompress from './pages/tools/PdfCompress'
import ImageCompress from './pages/tools/ImageCompress'
import About from './pages/legal/About'
import Contact from './pages/legal/Contact'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import PageLoader from './components/PageLoader'

const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <SinglePost /> },
      { path: 'hellowsaipatit', element: <AdminPanel /> },
      { path: 'pdf-merge', element: <PdfMerge /> },
      { path: 'pdf-split', element: <PdfSplit /> },
      { path: 'pdf-compress', element: <PdfCompress /> },
      { path: 'image-compress', element: <ImageCompress /> },
      { path: 'age-calculator', element: <AgeCalc /> },
      { path: 'percentage-calc', element: <PercentageCalc /> },
      { path: 'qr-code-gen', element: <QrCodeGen /> },
      { path: 'cv-maker', element: <CvMaker /> },
      { path: 'video-downloader', element: <VideoDownloader /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy-policy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function Router() { return <RouterProvider router={router} /> }