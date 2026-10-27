import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function AgeCalc() {
  const today = new Date().toISOString().split('T')[0]
  const [dob, setDob] = useState('')
  const [targetDate, setTargetDate] = useState(today)
  const [toolData, setToolData] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    fetch('/api/tools').then(r => r.json()).then(d => {
      if(Array.isArray(d)) {
        const t = d.find(x => x.slug === 'age-calculator')
        if(t) setToolData(t)
      }
    }).catch(()=>{})
  }, [])

  const calculateAge = () => {
    if(!dob || !targetDate) return null
    const birth = new Date(dob)
    const target = new Date(targetDate)
    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()
    if (days < 0) { months--; const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0); days += prevMonth.getDate() }
    if (months < 0) { years--; months += 12 }
    return { years, months, days }
  }

  const result = calculateAge()
  
  let faqs = []
  try { faqs = JSON.parse(toolData?.faq_json || '[]') } catch(e) {}

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-[#F97316]">Home</Link> <ChevronRight size={14}/> <span className="text-[#F97316]">Age Calculator</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#431407]">{toolData?.h1_title || 'Age Calculator Online Free'}</h1>
      <p className="text-slate-600 mb-8">{toolData?.intro_text || 'Calculate your exact age in years, months, and days.'}</p>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFEDD5] space-y-5 mb-12">
        <div>
          <label className="text-sm font-semibold text-[#431407]">Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full p-3 border border-[#FFEDD5] rounded-xl mt-1 bg-slate-50" />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#431407]">Age at Date</label>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full p-3 border border-[#FFEDD5] rounded-xl mt-1 bg-slate-50" />
        </div>
        {result && (
          <div className="bg-[#FFF7ED] p-6 rounded-xl text-center mt-4">
            <p className="text-sm text-slate-600 mb-2">Calculated Age</p>
            <p className="text-3xl font-bold text-[#F97316]">{result.years} Years</p>
            <p className="text-lg font-semibold text-[#F97316] mt-1">{result.months} Months, {result.days} Days</p>
          </div>
        )}
      </div>

      {faqs.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#FFEDD5] shadow-sm">
          <h2 className="text-2xl font-bold text-[#431407] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-slate-800">{faq.q}</h3>
                <p className="text-slate-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}