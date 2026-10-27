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
import AgeCalc from './pages/tools/AgeCalc'
import PercentageCalc from './pages/tools/PercentageCalc'
import QrCodeGen from './pages/tools/QrCodeGen'
import HtmlToText from './pages/tools/HtmlToText'
import CsvToJson from './pages/tools/CsvToJson'
import CvMaker from './pages/tools/CvMaker'
import YoutubeMeta from './pages/tools/YoutubeMeta'
import VideoDownloader from './pages/tools/VideoDownloader'
import SocialChecker from './pages/tools/SocialChecker'

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
      
      // Individual Tools
      { path: 'age-calculator', element: <AgeCalc /> },
      { path: 'percentage-calc', element: <PercentageCalc /> },
      { path: 'qr-code-gen', element: <QrCodeGen /> },
      { path: 'html-to-text', element: <HtmlToText /> },
      { path: 'csv-to-json', element: <CsvToJson /> },
      { path: 'cv-maker', element: <CvMaker /> },
      { path: 'youtube-meta', element: <YoutubeMeta /> },
      { path: 'video-downloader', element: <VideoDownloader /> },
      { path: 'social-checker', element: <SocialChecker /> },
      
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function Router() { return <RouterProvider router={router} /> }