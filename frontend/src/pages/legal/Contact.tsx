export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Contact Us</h1>
      <p className="text-slate-600 mb-8">Have a question, feedback, or a tool request? We'd love to hear from you.</p>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-900">Email Support</h3>
          <a href="mailto:support@banglabytex.com" className="text-brand-600 hover:underline">support@banglabytex.com</a>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Business Inquiries</h3>
          <a href="mailto:hello@banglabytex.com" className="text-brand-600 hover:underline">hello@banglabytex.com</a>
        </div>
      </div>
    </div>
  )
}