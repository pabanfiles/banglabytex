import Seo from '../../components/Seo'
export default function Terms() {
  return (
    <>
      <Seo title="Terms of Use | PPM Creator" description="Terms under which PPM Creator tools are provided." path="/terms" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Terms of Use</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Last updated: October 2026</p>

        <h2 style={h2}>1. Acceptance</h2>
        <p>By using ppmcreator.pages.dev or any tool on it, you agree to these terms. If you do not agree, please do not use the site.</p>

        <h2 style={h2}>2. Service</h2>
        <p>The tools are provided free of charge, as is, without any guarantee of availability, accuracy or fitness for a particular purpose. We may change, suspend or remove a tool at any time.</p>

        <h2 style={h2}>3. Acceptable use</h2>
        <p>You agree not to use the site to:</p>
        <ul style={{ paddingLeft: 22 }}>
          <li>Upload or process any file that you do not have the right to use.</li>
          <li>Attempt to break, overload or interfere with the site or its infrastructure.</li>
          <li>Use the site to break any law in your country.</li>
          <li>Resell the tools as your own.</li>
        </ul>

        <h2 style={h2}>4. Your files</h2>
        <p>Most tools process files inside your browser. You keep full ownership of any file you use. We do not claim any rights over your content. For tools that require a server (rare), the file is deleted from the temporary store as soon as the result is delivered.</p>

        <h2 style={h2}>5. Accounts</h2>
        <p>You are responsible for keeping your password and email secure. If you notice unauthorized access, write to <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a> immediately. We may suspend an account that breaks these terms.</p>

        <h2 style={h2}>6. No warranty</h2>
        <p>The tools are provided without warranty of any kind, express or implied. We are not responsible for any loss caused by using the site, including loss of data, missed deadlines or incorrect output. Always keep a copy of the original file.</p>

        <h2 style={h2}>7. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential damages arising from the use of the site.</p>

        <h2 style={h2}>8. Changes</h2>
        <p>We may update these terms. The date at the top shows the latest version. Continued use after a change means you accept the new terms.</p>

        <h2 style={h2}>9. Contact</h2>
        <p>Questions? Write to <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>.</p>
      </main>
    </>
  )
}
const h2: React.CSSProperties = { fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }