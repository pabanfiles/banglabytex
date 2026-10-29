import { useRef, useState } from 'react'

export default function UploadBox({ accept = 'image/*', maxMB = 25, hint, onFile }) {
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const handle = (file) => {
    setError('')
    if (!file) return
    if (maxMB && file.size > maxMB * 1024 * 1024) { setError('This file is over ' + maxMB + ' MB.'); return }
    onFile(file)
  }
  return (
    <div style={{ position: 'relative' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]) }}
        style={{ border: '2px dashed ' + (drag ? '#F97316' : '#e7e5e4'), borderRadius: 14, padding: '34px 14px', textAlign: 'center', background: '#fff' }}
      >
        <b style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>Choose a file or drop it here</b>
        <small style={{ color: '#6b7280' }}>{hint || ('Up to ' + maxMB + ' MB - nothing is uploaded')}</small>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label="Choose a file"
        onChange={(e) => { handle(e.target.files?.[0]); if (inputRef.current) inputRef.current.value = '' }}
        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', fontSize: 0 }}
      />
      {error ? <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p> : null}
    </div>
  )
}