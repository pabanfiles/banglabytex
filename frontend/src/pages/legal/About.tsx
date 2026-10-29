import Seo from '../../components/Seo'
export default function About() {
  return (
    <>
      <Seo title="About | PPM Creator" description="PPM Creator is a free collection of browser-based tools for images, PDFs, text and everyday calculations. Files stay on your device." path="/about" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>About PPM Creator</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 32px' }}>Free browser tools for images, PDFs, text and everyday tasks.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>What we do</h2>
        <p>PPM Creator is a growing collection of free online tools. The idea is simple: every tool runs inside your browser, so your files never leave your device. No signup, no upload, no waiting for a server.</p>
        <p>You can compress an image, merge a PDF, calculate your age, generate a QR code, test a piece of HTML or convert a CSV to JSON â€” all without installing anything.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>Why we built it</h2>
        <p>Most online tools ask for an email, upload your file to a server, and show ads before you can download the result. That model works, but it is slow and it puts your private files in someone else's hands.</p>
        <p>We wanted a different approach: keep the processing local, keep the interface fast, and keep the tool free. Every tool on this site follows that rule.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>How it works</h2>
        <p>The site is built on modern web technology: React for the interface, Cloudflare Pages for hosting, and browser APIs such as Canvas, WebAssembly and PDF libraries for the actual work. When a tool can run entirely in your browser, it does. When it cannot, we tell you.</p>
        <p>We never claim a result that we have not tested. If a tool does not fully work in your browser, we say so on the page.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>Get in touch</h2>
        <p>Questions, bug reports and feature ideas are welcome. Use the <a href="/contact" style={{ color: '#F97316' }}>contact form</a> or email us at <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>.</p>

        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 40 }}>Last updated: October 2026</p>
      </main>
    </>
  )
}