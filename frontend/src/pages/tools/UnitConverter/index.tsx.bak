import { useState } from 'react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function UnitConverter() {
  const { toolData, faqs, relatedPosts } = useToolData('unit-converter')
  const [val, setVal] = useState(1)
  const [type, setType] = useState('km-to-miles')

  const convert = () => {
    if(type === 'km-to-miles') return (val * 0.621371).toFixed(4)
    if(type === 'miles-to-km') return (val * 1.60934).toFixed(4)
    if(type === 'kg-to-lbs') return (val * 2.20462).toFixed(4)
    if(type === 'lbs-to-kg') return (val * 0.453592).toFixed(4)
    return val
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Unit Converter'} description={toolData?.intro_text || 'Convert length and weight units easily.'} category="Utility" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full p-4 border rounded-xl mb-4" />
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-4 border rounded-xl mb-4">
          <option value="km-to-miles">Kilometers to Miles</option>
          <option value="miles-to-km">Miles to Kilometers</option>
          <option value="kg-to-lbs">Kilograms to Pounds</option>
          <option value="lbs-to-kg">Pounds to Kilograms</option>
        </select>
        <div className="bg-[#FFF7ED] dark:bg-slate-700 p-6 rounded-xl text-center">
          <p className="text-3xl font-bold text-[#F97316]">{convert()}</p>
        </div>
      </div>
    </ToolPageLayout>
  )
}