import { useState } from 'react'
export default function PercentageCalc() {
  const [percent, setPercent] = useState(10)
  const [total, setTotal] = useState(500)
  const result = (percent / 100) * total
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Percentage Calculator</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <div>
          <label className="text-sm font-semibold">Percentage (%)</label>
          <input type="number" value={percent} onChange={e => setPercent(Number(e.target.value))} className="w-full p-3 border rounded-xl mt-1" />
        </div>
        <div>
          <label className="text-sm font-semibold">Total Value</label>
          <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} className="w-full p-3 border rounded-xl mt-1" />
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl text-center mt-4">
          <p className="text-sm text-slate-600">Result ({percent}% of {total})</p>
          <p className="text-3xl font-bold text-emerald-600">{result}</p>
          <p className="text-sm text-slate-500 mt-2">Remaining: {total - result}</p>
        </div>
      </div>
    </div>
  )
}