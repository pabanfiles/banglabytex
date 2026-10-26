import { useState } from 'react'
import { Mail, Send, CheckCircle2 } from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // বাস্তব অ্যাপে এখানে EmailJS বা ব্যাকএন্ড API কল হবে
    setTimeout(() => setSubmitted(true), 1000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Have a question, feedback, or a tool request? We'd love to hear from you. Fill out the form below or email us directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Email Support</h3>
              <a href="mailto:support@banglabytex.com" className="text-emerald-600 hover:underline">support@banglabytex.com</a>
              <p className="text-sm text-slate-500 mt-1">We usually reply within 24 hours.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <Send size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Business Inquiries</h3>
              <a href="mailto:hello@banglabytex.com" className="text-emerald-600 hover:underline">hello@banglabytex.com</a>
              <p className="text-sm text-slate-500 mt-1">For partnerships and collaborations.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-500">Thank you for reaching out. We will get back to you soon.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-emerald-600 font-semibold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" required placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea required rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}