import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PercentageCalc() {
  const [percent, setPercent] = useState(10)
  const [total, setTotal] = useState(500)
  const result = (percent / 100) * total

  // Schema.org JSON-LD
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Percentage Calculator",
      "url": "https://ppmcreator.com/percentage-calc",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    })
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-sm text-slate-500 mb-4">
        <Link to="/" className="hover:text-[#F97316]">Home</Link> / <span className="text-[#F97316]">Percentage Calculator</span>
      </div>

      <h1 className="text-3xl font-extrabold mb-6 text-[#431407]">Percentage Calculator Online Free</h1>
      <p className="text-slate-600 mb-8">Calculate percentages quickly and easily. Just enter the total value and the percentage you want to find out.</p>

      {/* Tool UI */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFEDD5] space-y-4 mb-12">
        <div>
          <label className="text-sm font-semibold text-[#431407]">Total Value</label>
          <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} className="w-full p-3 border border-[#FFEDD5] rounded-xl mt-1 outline-none focus:ring-2 focus:ring-[#F97316]" />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#431407]">Percentage (%)</label>
          <input type="number" value={percent} onChange={e => setPercent(Number(e.target.value))} className="w-full p-3 border border-[#FFEDD5] rounded-xl mt-1 outline-none focus:ring-2 focus:ring-[#F97316]" />
        </div>
        <div className="bg-[#FFF7ED] p-6 rounded-xl text-center mt-4">
          <p className="text-sm text-slate-600 mb-1">Result ({percent}% of {total})</p>
          <p className="text-4xl font-bold text-[#F97316]">{result}</p>
        </div>
      </div>

      {/* Content for SEO */}
      <div className="prose prose-slate max-w-none mb-12">
        <h2 className="text-2xl font-bold text-[#431407] mb-4">How to use the Percentage Calculator</h2>
        <ol className="list-decimal pl-5 space-y-2 text-slate-600">
          <li>Enter the total value in the first input box (e.g., 500).</li>
          <li>Enter the percentage you want to calculate in the second box (e.g., 10).</li>
          <li>The result will automatically appear below, showing the exact calculated amount.</li>
        </ol>

        <h2 className="text-2xl font-bold text-[#431407] mt-8 mb-4">Features and Benefits</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Instant Results:</strong> No need to press a calculate button; it updates live.</li>
          <li><strong>100% Free:</strong> Use it as many times as you want without any limits.</li>
          <li><strong>Privacy First:</strong> Everything is calculated in your browser. No data is sent to our servers.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#431407] mt-8 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-[#431407]">How do I calculate a percentage of a number?</h3>
            <p className="text-slate-600">To calculate X% of Y, simply multiply Y by (X/100). Our tool does this automatically for you.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#431407]">Is this calculator accurate for financial use?</h3>
            <p className="text-slate-600">Yes, it uses standard mathematical formulas and is perfectly accurate for daily financial calculations and discounts.</p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div>
        <h2 className="text-xl font-bold text-[#431407] mb-4">Related Tools</h2>
        <div className="flex gap-4 flex-wrap">
          <Link to="/age-calc" className="px-4 py-2 bg-white border border-[#FFEDD5] rounded-xl text-[#F97316] font-semibold hover:bg-[#FFF7ED]">Age Calculator</Link>
          <Link to="/pdf-tools" className="px-4 py-2 bg-white border border-[#FFEDD5] rounded-xl text-[#F97316] font-semibold hover:bg-[#FFF7ED]">PDF Tools</Link>
        </div>
      </div>
    </div>
  )
}