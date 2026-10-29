import { Link } from 'react-router-dom'
import Seo from '../../components/Seo'
const groups = [
  { title: 'Main pages', items: [['Home','/'],['Blog','/blog'],['About','/about'],['Contact','/contact'],['Privacy','/privacy-policy'],['Terms','/terms'],['Disclaimer','/disclaimer']] },
  { title: 'Image tools', items: [['Image Compressor','/image-compress'],['Image Resizer','/image-resize'],['Image Converter','/image-convert'],['Image Cropper','/image-crop'],['Image Rotate','/image-rotate'],['Image to PDF','/image-to-pdf'],['Image to Base64','/image-to-base64'],['Meme Generator','/meme-generator'],['Image to Text','/image-to-text'],['Passport Photo','/passport-photo'],['Image Color Picker','/image-color-picker'],['Image Watermark','/image-watermark'],['Favicon Generator','/favicon-generator'],['Background Remover','/bg-remover']] },
  { title: 'PDF tools', items: [['Merge PDF','/pdf-merge'],['Split PDF','/pdf-split'],['Compress PDF','/pdf-compress'],['Protect PDF','/pdf-protect'],['Unlock PDF','/pdf-unlock'],['PDF to Word','/pdf-to-word'],['PDF to Excel','/pdf-to-excel'],['PDF to PPT','/pdf-to-ppt'],['PDF to CSV','/pdf-to-csv'],['PDF to HTML','/pdf-to-html']] },
  { title: 'Converters', items: [['Word to PDF','/word-to-pdf'],['Word to Excel','/word-to-excel'],['Word to PPT','/word-to-ppt'],['Word to HTML','/word-to-html'],['Excel to PDF','/excel-to-pdf'],['Excel to Word','/excel-to-word'],['Excel to CSV','/excel-to-csv'],['PPT to PDF','/ppt-to-pdf'],['CSV to PDF','/csv-to-pdf'],['CSV to JSON','/csv-to-json'],['Office to PDF','/office-to-pdf'],['HTML to Text','/html-to-text']] },
  { title: 'Calculators & text', items: [['Age Calculator','/age-calculator'],['Percentage Calculator','/percentage-calc'],['Unit Converter','/unit-converter'],['Word Counter','/word-counter'],['Text Case Converter','/text-case-converter'],['Password Generator','/password-generator'],['QR Code Generator','/qr-code-gen'],['CV Maker','/cv-maker'],['EXIF Viewer','/exif-viewer']] }
]
export default function SitemapPage() {
  return (
    <>
      <Seo title='Sitemap | PPM Creator' description='Browse every page and tool on PPM Creator.' path='/sitemap' />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px' }}>
        <h1>Sitemap</h1>
        {groups.map((g) => (
          <section key={g.title} style={{ marginTop: 24 }}>
            <h2>{g.title}</h2>
            <ul style={{ paddingLeft: 22 }}>
              {g.items.map((it) => <li key={it[1]}><Link to={it[1]} style={{ color: '#1c1917' }}>{it[0]}</Link></li>)}
            </ul>
          </section>
        ))}
      </main>
    </>
  )
}