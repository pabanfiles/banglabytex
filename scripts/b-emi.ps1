$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\tools"
function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}
function BK($rel) { $f = Join-Path $root $rel; if (Test-Path -LiteralPath $f) { Copy-Item -LiteralPath $f -Destination "$f.bak" -Force } }

Write-Host "=== EMI Calculator (real) ===" -ForegroundColor Cyan
BK "EmiCalculator\index.tsx"
WF "EmiCalculator\index.tsx" @"
import { useMemo, useState } from 'react'
import ToolShell from '@/components/ToolShell'

function fmt(n: number): string {
  if (!isFinite(n)) return '0'
  const s = Math.round(n).toString()
  const last3 = s.slice(-3)
  const rest = s.slice(0, -3)
  return rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(9.5)
  const [years, setYears] = useState(5)
  const [months, setMonths] = useState(0)

  const result = useMemo(() => {
    const n = years * 12 + months
    if (n <= 0 || principal <= 0) return null
    const r = rate / 12 / 100
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    const interest = total - principal
    const firstInterest = principal * r
    const firstPrincipal = emi - firstInterest
    return { emi, total, interest, n, firstInterest, firstPrincipal, principal }
  }, [principal, rate, years, months])

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is an EMI?', a: 'EMI stands for Equated Monthly Instalment. It is the fixed amount you pay every month to repay a loan. Each payment includes some interest and some principal, and the split changes over the loan term.' },
      { q: 'How is EMI calculated?', a: 'EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the loan amount, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the number of monthly instalments.' },
      { q: 'Is this tool free?', a: 'Yes. No account is needed, and no numbers are uploaded. Everything runs in your browser.' },
    ]},
    { heading: 'Using the result', items: [
      { q: 'Why is the total interest so high?', a: 'Interest is charged on the outstanding balance every month. Over a long tenure, the interest adds up to a large share of the total payment, even though the monthly EMI looks small.' },
      { q: 'What happens if I increase the tenure?', a: 'A longer tenure reduces the monthly EMI but increases the total interest paid. A shorter tenure does the opposite: higher EMI, lower total interest.' },
      { q: 'Does this include processing fees?', a: 'No. Bank processing fees, insurance, and other charges are separate. Always check the lender official schedule for the exact total cost.' },
    ]},
    { heading: 'Accuracy', items: [
      { q: 'How accurate is the result?', a: 'The formula is exact for a fixed-rate loan with monthly compounding. Real bank products may use daily compounding or add-ons. Treat the result as a close estimate and confirm with the lender.' },
      { q: 'Does it support floating rates?', a: 'No. Floating rates change with the market. This tool assumes the rate stays the same for the whole loan, so use it as a starting point.' },
      { q: 'Can I see the full amortization schedule?', a: 'Not in this version. Only the first month split is shown. For a full schedule, use a spreadsheet or ask the lender for the repayment schedule.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Are my numbers stored?', a: 'No. The inputs stay in your browser. Nothing is uploaded and nothing is saved after you close the tab.' },
      { q: 'Can I share the result?', a: 'Yes. Copy the numbers manually or take a screenshot. The page does not create a link with the inputs embedded.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to calculate EMI</h2>
      <ol>
        <li>Enter the loan amount.</li>
        <li>Enter the annual interest rate.</li>
        <li>Set the tenure in years and months.</li>
        <li>The monthly EMI, total interest, and total payment update immediately.</li>
      </ol>
      <h2>Understanding the result</h2>
      <p>The monthly EMI is the amount you pay every month. The total interest is the sum of all interest payments over the tenure. The total payment is the EMI times the number of months. The first-month split shows how much of the first EMI goes to interest and how much reduces the principal.</p>
      <p>Early in the loan, most of the EMI goes to interest because the outstanding balance is large. Later, most goes to principal. This is normal for amortising loans, and it is why prepaying early saves more interest than prepaying later.</p>
      <h2>Common mistakes</h2>
      <ul>
        <li>Comparing EMIs without comparing total interest.</li>
        <li>Forgetting processing fees and insurance.</li>
        <li>Assuming a floating rate will stay flat.</li>
        <li>Choosing the longest tenure just to lower the EMI.</li>
      </ul>
      <h2>Privacy and data</h2>
      <p>All inputs stay in your browser. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="EMI Calculator Online Free | PPM Creator"
      description="Calculate monthly EMI, total interest and total payment for a loan. Runs in your browser."
      path="/emi-calculator"
      crumb={[{ label: 'Calculators', to: '/calculators' }]}
      h1="EMI Calculator"
      lead="Enter the loan amount, rate and tenure to see the monthly EMI, total interest and total payment."
      faqGroups={faqGroups}
      related={[
        { name: 'Percentage Calculator', href: '/percentage-calc', blurb: 'Calculate percentages easily' },
        { name: 'Age Calculator', href: '/age-calculator', blurb: 'Calculate your exact age' },
        { name: 'Unit Converter', href: '/unit-converter', blurb: 'Convert between units' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
      ]}
      guides={[
        { title: 'EMI vs total cost: what to compare' },
        { title: 'Fixed vs floating interest rates' },
        { title: 'Why prepaying early saves interest' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Loan amount</label>
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontSize: 14 }} />
        <label style={{ fontSize: 13, color: '#6b7280' }}>Annual interest rate (%)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontSize: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Tenure (years)</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Tenure (months)</label>
            <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontSize: 14 }} />
          </div>
        </div>

        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 8 }}>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14 }}>
              <small style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Monthly EMI</small>
              <b style={{ fontSize: 22, fontWeight: 600 }}>Rs {fmt(result.emi)}</b>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14 }}>
              <small style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Total interest</small>
              <b style={{ fontSize: 22, fontWeight: 600 }}>Rs {fmt(result.interest)}</b>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14 }}>
              <small style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Total payment</small>
              <b style={{ fontSize: 22, fontWeight: 600 }}>Rs {fmt(result.total)}</b>
            </div>
          </div>
        )}

        {result && (
          <div style={{ marginTop: 14, padding: 12, background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12 }}>
            <b style={{ fontSize: 13 }}>First month split ({result.n} total months)</b>
            <div style={{ marginTop: 6, fontSize: 13, color: '#6b7280' }}>
              Interest: Rs {fmt(result.firstInterest)} · Principal: Rs {fmt(result.firstPrincipal)}
            </div>
            <div style={{ marginTop: 8, height: 10, background: '#e7e5e4', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
              <div style={{ height: '100%', background: '#B45309', width: Math.round((result.firstInterest / result.emi) * 100) + '%' }} />
              <div style={{ height: '100%', background: '#15803D', width: Math.round((result.firstPrincipal / result.emi) * 100) + '%' }} />
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>Orange = interest · Green = principal</div>
          </div>
        )}

        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 14, background: '#FFF7ED', padding: 10, borderRadius: 8 }}>
          Estimate only. Bank processing fees, insurance and other charges are separate. Always confirm the final schedule with the lender.
        </p>
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] EmiCalculator done" -ForegroundColor Green
Write-Host "=== Batch B1 complete. Build next. ===" -ForegroundColor Green