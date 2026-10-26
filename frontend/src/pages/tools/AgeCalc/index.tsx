import { useState } from 'react'

export default function AgeCalc() {
  const today = new Date().toISOString().split('T')[0]
  const [dob, setDob] = useState('')
  const [targetDate, setTargetDate] = useState(today)

  const calculateAge = () => {
    if(!dob || !targetDate) return null
    const birth = new Date(dob)
    const target = new Date(targetDate)
    
    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    return { years, months, days }
  }

  const result = calculateAge()

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Age Calculator</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-5">
        
        <div>
          <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
          <input 
            type="date" 
            value={dob} 
            onChange={e => setDob(e.target.value)} 
            className="w-full p-3 border rounded-xl mt-1 bg-slate-50" 
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Age at Date</label>
          <input 
            type="date" 
            value={targetDate} 
            onChange={e => setTargetDate(e.target.value)} 
            className="w-full p-3 border rounded-xl mt-1 bg-slate-50" 
          />
          <p className="text-xs text-slate-400 mt-1">Default is today's date.</p>
        </div>

        {result && (
          <div className="bg-emerald-50 p-6 rounded-xl text-center mt-4">
            <p className="text-sm text-slate-600 mb-2">Calculated Age</p>
            <p className="text-3xl font-bold text-emerald-600">
              {result.years} Years
            </p>
            <p className="text-lg font-semibold text-emerald-500 mt-1">
              {result.months} Months, {result.days} Days
            </p>
          </div>
        )}
      </div>
    </div>
  )
}