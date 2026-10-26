import { useState } from 'react'
import { QrCode, Download } from 'lucide-react'

export default function QrCodeGen() {
  const [text, setText] = useState('')
  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}` : ''

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">QR Code Generator</h1>
        <p className="text-slate-500">Generate a QR code for any link or text instantly.</p>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4 text-center">
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Enter URL or Text..." 
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
        />
        
        {qrUrl && (
          <div className="mt-6 flex flex-col items-center">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded-xl border border-slate-200" />
            <a 
              href={qrUrl} 
              target="_blank" 
              download="qrcode.png"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition"
            >
              <Download size={18} /> Download QR
            </a>
          </div>
        )}
      </div>
    </div>
  )
}