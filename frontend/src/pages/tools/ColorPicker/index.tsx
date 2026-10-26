import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6')
  const hex = color.toUpperCase()
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const hsl = (() => {
    const rn = r / 255, gn = g / 255, bn = b / 255
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
      else if (max === gn) h = ((bn - rn) / d + 2) / 6
      else h = ((rn - gn) / d + 4) / 6
    }
    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
  })()
  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success('Copied!') }
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🎨 Color Picker</h1>
        <p className="mt-2 text-slate-600">Pick a color and copy the code.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 space-y-4">
        <div className="h-40 rounded-xl" style={{ backgroundColor: color }}></div>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-16 rounded-lg cursor-pointer" />
        {[
          ['HEX', hex],
          ['RGB', `rgb(${r}, ${g}, ${b})`],
          ['HSL', `hsl(${hsl})`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="font-mono font-medium text-slate-900">{value}</p>
            </div>
            <button onClick={() => copy(value)} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg"><Copy size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}