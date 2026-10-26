import { useState } from 'react'

export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000)
  const [rate, setRate] = useState(9)
  const [years, setYears] = useState(5)

  const monthlyRate = rate / 12 / 100
  const months = years * 12
  const emi = monthlyRate > 0
    ? (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : amount / months
  const totalAmount = emi * months
  const totalInterest = totalAmount - amount

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🧮 EMI Calculator</h1>
        <p className="mt-2 text-slate-600">Calculate your monthly loan payment instantly.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700">Loan Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500" />
          <input type="range" min={10000} max={10000000} step={10000} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Interest Rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Loan Tenure (Years)</label>
          <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500" />
        </div>
        <div className="bg-brand-50 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600">Monthly EMI</p>
          <p className="text-4xl font-bold text-brand-600">₹{emi.toFixed(0)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-xs text-slate-500">Total Interest</p>
            <p className="text-lg font-bold text-slate-800">₹{totalInterest.toFixed(0)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-xs text-slate-500">Total Payment</p>
            <p className="text-lg font-bold text-slate-800">₹{totalAmount.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}