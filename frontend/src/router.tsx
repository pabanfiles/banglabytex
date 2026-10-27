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
import PdfMerge from './pages/tools/PdfTools/PdfMerge'
import PdfSplit from './pages/tools/PdfTools/PdfSplit'
import PdfCompress from './pages/tools/PdfTools/PdfCompress'
import ImageCompress from './pages/tools/PdfTools/ImageCompress'
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
      { path: 'age-calculator', element: <AgeCalc /> },
      { path: 'percentage-calc', element: <PercentageCalc /> },
      { path: 'qr-code-gen', element: <QrCodeGen /> },
      { path: 'cv-maker', element: <CvMaker /> },
      { path: 'video-downloader', element: <VideoDownloader /> },
      { path: 'pdf-merge', element: <PdfMerge /> },
      { path: 'pdf-split', element: <PdfSplit /> },
      { path: 'pdf-compress', element: <PdfCompress /> },
      { path: 'image-compress', element: <ImageCompress /> },
      ...toolRoutes,
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function Router() { return <RouterProvider router={newRouter} /> }