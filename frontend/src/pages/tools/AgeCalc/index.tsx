import { useState } from 'react'
export default function AgeCalc() {
  const [dob, setDob] = useState('')
  const calculateAge = () => {
    if(!dob) return null
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }
  const age = calculateAge()
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Age Calculator</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <label className="text-sm font-semibold">Enter your Date of Birth</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full p-3 border rounded-xl mt-1" />
        {age !== null && (
          <div className="bg-emerald-50 p-6 rounded-xl text-center mt-4">
            <p className="text-sm text-slate-600">Your Age</p>
            <p className="text-4xl font-bold text-emerald-600">{age} Years</p>
          </div>
        )}
      </div>
    </div>
  )
}