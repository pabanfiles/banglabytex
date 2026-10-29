import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'

const CATS: Record<string, { title: string; blurb: string; items: { name: string; href: string; blurb: string }[] }> = {
  'image-tools': {
    title: 'Image Tools',
    blurb: 'Compress, resize, convert, crop and edit images in your browser.',
    items: [
      { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
      { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
      { name: 'Image Converter', href: '/image-convert', blurb: 'Convert between JPG, PNG and WebP' },
      { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
      { name: 'Image Rotate', href: '/image-rotate', blurb: 'Rotate or flip a photo' },
      { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
      { name: 'Image to Base64', href: '/image-to-base64', blurb: 'Turn an image into text' },
      { name: 'Meme Generator', href: '/meme-generator', blurb: 'Add top and bottom text' },
      { name: 'Image to Text', href: '/image-to-text', blurb: 'OCR printed text' },
      { name: 'Passport Photo', href: '/passport-photo', blurb: 'Crop to a common size' },
      { name: 'Image Color Picker', href: '/image-color-picker', blurb: 'Pick a pixel colour' },
      { name: 'Image Watermark', href: '/image-watermark', blurb: 'Add a text watermark' },
      { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons' },
      { name: 'Background Remover', href: '/bg-remover', blurb: 'Remove a background colour' },
    ],
  },
  'pdf-tools': {
    title: 'PDF Tools',
    blurb: 'Merge, split, compress, protect and unlock PDFs in your browser.',
    items: [
      { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs' },
      { name: 'Split PDF', href: '/pdf-split', blurb: 'Split by page range' },
      { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
      { name: 'Protect PDF', href: '/pdf-protect', blurb: 'Add a password' },
      { name: 'Unlock PDF', href: '/pdf-unlock', blurb: 'Remove a known password' },
    ],
  },
  'calculators': {
    title: 'Calculators',
    blurb: 'Age, percentage, EMI, unit conversion and more.',
    items: [
      { name: 'Age Calculator', href: '/age-calculator', blurb: 'Exact age in years, months, days' },
      { name: 'Percentage Calculator', href: '/percentage-calc', blurb: 'Percentage of, change, is what %' },
      { name: 'EMI Calculator', href: '/emi-calculator', blurb: 'Loan EMI and total interest' },
      { name: 'Unit Converter', href: '/unit-converter', blurb: 'Length, weight, temperature' },
    ],
  },
  'text-tools': {
    title: 'Text Tools',
    blurb: 'Count, change case, convert CSV and HTML to text.',
    items: [
      { name: 'Word Counter', href: '/word-counter', blurb: 'Words, characters, read time' },
      { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Upper, lower, title, reverse' },
      { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags' },
      { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV to JSON' },
      { name: 'Password Generator', href: '/password-generator', blurb: 'Strong random password' },
      { name: 'HTML CSS JS Runner', href: '/code-runner', blurb: 'Run code live in your browser' },
    ],
  },
}

export default function CategoryHub() {
  const { slug } = useParams()
  const cat = CATS[slug || '']
  if (!cat) return <div style={{ padding: 40 }}>Category not found. <Link to="/">Go home</Link></div>
  return (
    <>
      <Seo title={cat.title + ' | PPM Creator'} description={cat.blurb} path={'/' + slug} />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 18px' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 8px', color: '#1c1917' }}>{cat.title}</h1>
        <p style={{ color: '#6b7280', margin: '0 0 24px' }}>{cat.blurb}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {cat.items.map((it) => (
            <Link key={it.href} to={it.href} style={{ display: 'block', padding: 16, border: '1px solid #e7e5e4', borderRadius: 12, background: '#fafaf9', textDecoration: 'none', color: '#1c1917' }}>
              <b style={{ display: 'block', fontWeight: 600 }}>{it.name}</b>
              <span style={{ display: 'block', color: '#6b7280', fontSize: 13, marginTop: 2 }}>{it.blurb}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}