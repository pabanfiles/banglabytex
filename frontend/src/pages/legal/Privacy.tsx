import Seo from '../../components/Seo'
export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy | PPM Creator" description="What PPM Creator stores, what it does not store, and how the tools handle your files." path="/privacy-policy" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Privacy Policy</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Last updated: October 2026</p>

        <h2 style={h2}>Short version</h2>
        <p>Most tools on this site process your files inside your browser. Those files are not uploaded and are not stored. We only collect anonymous usage counts (how many times a tool ran) so we can see which tools people use.</p>

        <h2 style={h2}>What we store</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li><b>Tool usage counts</b> â€” the name of the tool and the number of runs, grouped by day. No file names, no file contents, no IP addresses, no personal data.</li>
          <li><b>Page view counts</b> â€” the URL path and the number of views, grouped by day. No IP addresses, no referrers.</li>
          <li><b>Account email</b> â€” if you create an account, we store your email address and a salted password hash. Passwords are never stored in plain text.</li>
          <li><b>Contact form messages</b> â€” name, email, subject and message, kept in our inbox only.</li>
        </ul>

        <h2 style={h2}>What we do not store</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>Your files or their contents. Images and PDFs are processed in your browser.</li>
          <li>Your IP address in a readable form.</li>
          <li>Any personal data beyond what is listed above.</li>
        </ul>

        <h2 style={h2}>Cookies</h2>
        <p>The site sets one cookie, <code>user_email</code>, only after you sign in. It keeps you logged in for 30 days. It does not track you across other sites. You can clear it any time from your browser settings.</p>

        <h2 style={h2}>Analytics</h2>
        <p>Page views come from Cloudflare Web Analytics, a privacy-friendly analytics service that does not use cookies or fingerprints. Tool runs come from a small anonymous counter in our database. Neither stores personal data.</p>

        <h2 style={h2}>Third-party services</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li><b>Cloudflare</b> â€” hosting, database, and page-view analytics.</li>
          <li><b>Google Sign-in</b> â€” optional. If you use it, Google shares your name and email with us, and only that.</li>
          <li><b>Email provider</b> â€” used to send verification and reset emails. Your email is shared only to deliver those messages.</li>
        </ul>

        <h2 style={h2}>Your rights</h2>
        <p>You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete it. Write to <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>. We respond within 30 days.</p>

        <h2 style={h2}>Children</h2>
        <p>The site is not directed to children under 13. We do not knowingly store data from children.</p>

        <h2 style={h2}>Changes</h2>
        <p>If this policy changes, we will update the date at the top of this page. Continued use of the site after a change means you accept the new policy.</p>
      </main>
    </>
  )
}
const h2: React.CSSProperties = { fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }