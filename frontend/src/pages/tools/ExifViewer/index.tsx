import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

type Tag = { tag: string; value: string }

function parseExif(buf: ArrayBuffer): Tag[] {
  const view = new DataView(buf)
  if (view.getUint16(0, false) !== 0xffd8) return []
  let offset = 2
  const tags: Tag[] = []
  while (offset < view.byteLength) {
    if (view.getUint16(offset, false) !== 0xffe1) break
    const len = view.getUint16(offset + 2, false)
    const exifStart = offset + 4
    if (view.getUint32(exifStart, false) === 0x45786966) {
      const tiffStart = exifStart + 6
      const little = view.getUint16(tiffStart, false) === 0x4949
      const readU16 = (o: number) => view.getUint16(o, little)
      const readU32 = (o: number) => view.getUint32(o, little)
      if (readU16(tiffStart + 2) === 42) {
        const first = readU32(tiffStart + 4)
        const entries = readU16(tiffStart + first)
        const names: Record<number, string> = {
          0x010f: 'Make', 0x0110: 'Model', 0x0112: 'Orientation',
          0x0131: 'Software', 0x0132: 'DateTime', 0x8769: 'ExifIFDPointer',
          0x8825: 'GPSInfoIFDPointer', 0x9003: 'DateTimeOriginal',
          0xa002: 'PixelXDimension', 0xa003: 'PixelYDimension',
        }
        for (let i = 0; i < entries; i++) {
          const entry = tiffStart + first + 2 + i * 12
          const tag = readU16(entry)
          const type = readU16(entry + 2)
          const count = readU32(entry + 4)
          const valueOffset = entry + 8
          const name = names[tag] || ('0x' + tag.toString(16))
          if (type === 2) {
            const ptr = count > 4 ? tiffStart + readU32(valueOffset) : valueOffset
            let str = ''
            for (let j = 0; j < count; j++) { const ch = view.getUint8(ptr + j); if (ch === 0) break; str += String.fromCharCode(ch) }
            tags.push({ tag: name, value: str })
          } else if (type === 3) {
            tags.push({ tag: name, value: String(readU16(valueOffset)) })
          } else if (type === 4) {
            tags.push({ tag: name, value: String(readU32(valueOffset)) })
          }
        }
      }
    }
    offset += 2 + len
  }
  return tags
}

export default function ExifViewer() {
  const [tags, setTags] = useState<Tag[]>([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (f: File) => {
    setError(''); setTags([]); setFileName(f.name); setLoading(true)
    if (!f.type.startsWith('image/')) { setError('Please choose a JPEG image.'); setLoading(false); return }
    try {
      const buf = await f.arrayBuffer()
      const result = parseExif(buf)
      if (result.length === 0) setError('No EXIF metadata found in this image. PNG and WebP files usually have none.')
      else setTags(result)
    } catch { setError('Could not read the EXIF metadata.') }
    setLoading(false)
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is EXIF data?', a: 'EXIF is metadata embedded in most camera photos. It can include the camera model, the date and time, and the orientation. Some phones also write GPS data unless location tagging is turned off.' },
      { q: 'What does this tool show?', a: 'It reads the common EXIF tags of a JPEG file and displays them as a table. PNG and WebP files usually have no EXIF, and the tool says so.' },
      { q: 'Is my image uploaded?', a: 'No. The file is read in your browser and is not sent to any server.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Does it show GPS location?', a: 'It can show the GPS tags if they are present, as raw values. It does not plot them on a map.' },
      { q: 'Should I remove EXIF before sharing?', a: 'Yes, if the photo has GPS or other private data. Use a metadata remover or re-save the image through a tool that strips EXIF, like a screenshot.' },
      { q: 'Does the tool store the file?', a: 'No. The file is read once and never saved.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why does no data appear?', a: 'The image may have no EXIF tags, may have been re-saved by a program that strips them, or may be in a format other than JPEG.' },
      { q: 'Can I export the result?', a: 'Not in this version. Copy the table values manually.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to view EXIF metadata</h2>
      <ol>
        <li>Upload a JPEG file.</li>
        <li>The tool shows the common EXIF tags.</li>
        <li>Copy the values you need.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Quick way to check what a photo carries before you share it. Everything runs locally.</p>
      <h2>Privacy and data</h2>
      <p>The file stays on your device.</p>
    </>
  )

  return (
    <ToolShell
      title="EXIF Viewer Online Free | PPM Creator"
      description="Read the EXIF metadata of a JPEG image in your browser. Nothing is uploaded."
      path="/exif-viewer"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="EXIF Viewer: Read Photo Metadata"
      lead="Upload a JPEG to see its EXIF tags. Nothing is uploaded."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change image format' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a size' },
        { name: 'BgRemover', href: '/bg-remover', blurb: 'Remove a background colour' },
      ]}
      guides={[
        { title: 'What EXIF reveals about a photo' },
        { title: 'Removing location data before sharing' },
        { title: 'Why some apps strip EXIF automatically' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <UploadBox accept="image/jpeg" maxMB={25} hint="JPEG image - up to 25 MB - nothing is uploaded" onFile={handleFile} />
        {loading && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 10 }}>Reading...</p>}
        {fileName && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 10 }}>{fileName}</p>}
        {tags.length > 0 && (
          <table style={{ width: '100%', marginTop: 14, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr><th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500 }}>Tag</th><th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500 }}>Value</th></tr></thead>
            <tbody>{tags.map((t, i) => (<tr key={i}><td style={{ padding: 8, borderBottom: '1px solid #e7e5e4', fontWeight: 600 }}>{t.tag}</td><td style={{ padding: 8, borderBottom: '1px solid #e7e5e4' }}>{t.value}</td></tr>))}</tbody>
          </table>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}