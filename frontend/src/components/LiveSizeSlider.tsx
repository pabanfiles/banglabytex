function kb(b) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }
export default function LiveSizeSlider({ value, min = 10, max = 100, onChange, originalBytes, newBytes, busy }) {
  const target = Math.round((originalBytes * value) / 100)
  const saved = newBytes != null && originalBytes > 0 ? Math.max(0, Math.round((1 - newBytes / originalBytes) * 100)) : null
  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 500 }}>Target size: how much of the original to keep</label>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '8px 0 2px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
        <span>{value}% of original = {kb(target)}</span>
        <span>{busy ? 'Calculating...' : (saved != null ? 'Saved ' + saved + '%' : '')}</span>
      </div>
    </div>
  )
}