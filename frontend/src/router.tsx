import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
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
import PdfProtect from './pages/tools/PdfProtect'
import PdfUnlock from './pages/tools/PdfUnlock'
import ImageCompress from './pages/tools/ImageCompress'
import ImageResize from './pages/tools/ImageResize'
import ImageConvert from './pages/tools/ImageConvert'
import ImageCrop from './pages/tools/ImageCrop'
import ImageRotate from './pages/tools/ImageRotate'
import PassportPhoto from './pages/tools/PassportPhoto'
import ImageToBase64 from './pages/tools/ImageToBase64'
import MemeGenerator from './pages/tools/MemeGenerator'
import ImageToText from './pages/tools/ImageToText'
import TextCase from './pages/tools/TextCase'
import WordCounter from './pages/tools/WordCounter'
import PasswordGen from './pages/tools/PasswordGen'
import UnitConverter from './pages/tools/UnitConverter'
import ExifViewer from './pages/tools/ExifViewer'
import ImageToPdf from './pages/tools/ImageToPdf'
import ImageColorPicker from './pages/tools/ImageColorPicker'
import ImageWatermark from './pages/tools/ImageWatermark'
import FaviconGenerator from './pages/tools/FaviconGenerator'
import BgRemover from './pages/tools/BgRemover'
import CsvToJson from './pages/tools/CsvToJson'
import HtmlToText from './pages/tools/HtmlToText'
import OfficeToPdf from './pages/tools/OfficeToPdf'
import PdfToWord from './pages/tools/PdfToWord'
import PdfToExcel from './pages/tools/PdfToExcel'
import PdfToPpt from './pages/tools/PdfToPpt'
import PdfToCsv from './pages/tools/PdfToCsv'
import PdfToHtml from './pages/tools/PdfToHtml'
import WordToPdf from './pages/tools/WordToPdf'
import WordToExcel from './pages/tools/WordToExcel'
import WordToPpt from './pages/tools/WordToPpt'
import WordToHtml from './pages/tools/WordToHtml'
import ExcelToPdf from './pages/tools/ExcelToPdf'
import ExcelToWord from './pages/tools/ExcelToWord'
import ExcelToCsv from './pages/tools/ExcelToCsv'
import PptToPdf from './pages/tools/PptToPdf'
import CsvToPdf from './pages/tools/CsvToPdf'
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
      { path: 'pdf-protect', element: <PdfProtect /> },
      { path: 'pdf-unlock', element: <PdfUnlock /> },
      { path: 'image-compress', element: <ImageCompress /> },
      { path: 'image-resize', element: <ImageResize /> },
      { path: 'image-convert', element: <ImageConvert /> },
      { path: 'image-crop', element: <ImageCrop /> },
      { path: 'image-rotate', element: <ImageRotate /> },
      { path: 'passport-photo', element: <PassportPhoto /> },
      { path: 'image-to-base64', element: <ImageToBase64 /> },
      { path: 'meme-generator', element: <MemeGenerator /> },
      { path: 'image-to-text', element: <ImageToText /> },
      { path: 'text-case-converter', element: <TextCase /> },
      { path: 'word-counter', element: <WordCounter /> },
      { path: 'password-generator', element: <PasswordGen /> },
      { path: 'unit-converter', element: <UnitConverter /> },
      { path: 'exif-viewer', element: <ExifViewer /> },
      { path: 'image-to-pdf', element: <ImageToPdf /> },
      { path: 'image-color-picker', element: <ImageColorPicker /> },
      { path: 'image-watermark', element: <ImageWatermark /> },
      { path: 'favicon-generator', element: <FaviconGenerator /> },
      { path: 'bg-remover', element: <BgRemover /> },
      { path: 'csv-to-json', element: <CsvToJson /> },
      { path: 'html-to-text', element: <HtmlToText /> },
      { path: 'office-to-pdf', element: <OfficeToPdf /> },
      { path: 'pdf-to-word', element: <PdfToWord /> },
      { path: 'pdf-to-excel', element: <PdfToExcel /> },
      { path: 'pdf-to-ppt', element: <PdfToPpt /> },
      { path: 'pdf-to-csv', element: <PdfToCsv /> },
      { path: 'pdf-to-html', element: <PdfToHtml /> },
      { path: 'word-to-pdf', element: <WordToPdf /> },
      { path: 'word-to-excel', element: <WordToExcel /> },
      { path: 'word-to-ppt', element: <WordToPpt /> },
      { path: 'word-to-html', element: <WordToHtml /> },
      { path: 'excel-to-pdf', element: <ExcelToPdf /> },
      { path: 'excel-to-word', element: <ExcelToWord /> },
      { path: 'excel-to-csv', element: <ExcelToCsv /> },
      { path: 'ppt-to-pdf', element: <PptToPdf /> },
      { path: 'csv-to-pdf', element: <CsvToPdf /> },
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