import Seo from '../../components/Seo'
export default function Disclaimer() {
  return (
    <>
      <Seo title="Disclaimer | PPM Creator" description="What PPM Creator tools do and do not guarantee." path="/disclaimer" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Disclaimer</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Last updated: October 2026</p>

        <h2 style={h2}>General</h2>
        <p>PPM Creator provides free online tools for images, PDFs, text and everyday calculations. The tools are provided as-is. We do not guarantee any specific result, file size or outcome.</p>

        <h2 style={h2}>No guarantee of outcome</h2>
        <p>Compression, conversion and calculation results depend on the input file and your device. Always check important output before using it for a form, submission or publication.</p>

        <h2 style={h2}>Not professional advice</h2>
        <p>Nothing on this site is legal, financial, medical, tax or government advice. For official form sizes, fees, deadlines or document requirements, always check the official instructions published by the relevant authority.</p>

        <h2 style={h2}>Government forms</h2>
        <p>We do not publish or claim government form sizes, prices or photo specifications. Every form sets its own rules, and those rules change. Check the official instructions for the form you are filling.</p>

        <h2 style={h2}>Third-party links</h2>
        <p>Some pages link to external sites. We are not responsible for their content, availability or privacy practices.</p>

        <h2 style={h2}>No warranty on uptime</h2>
        <p>We aim to keep the site running, but we do not guarantee uptime. Plan ahead for time-sensitive tasks and keep a backup of your work.</p>

        <h2 style={h2}>Contact</h2>
        <p>Questions? Email <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>.</p>
      </main>
    </>
  )
}
const h2: React.CSSProperties = { fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }