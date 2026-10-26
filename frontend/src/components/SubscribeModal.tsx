import { useState, useEffect } from 'react'
import { Facebook, Youtube, Instagram, Send, Lock } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onUnlock: () => void
}

export default function SubscribeModal({ isOpen, onClose, onUnlock }: Props) {
  const [timer, setTimer] = useState(15)
  const [isVerifying, setIsVerifying] = useState(false)

  const links = [
    { url: 'https://www.facebook.com/banglabytex', icon: Facebook, color: 'bg-blue-600' },
    { url: 'https://www.youtube.com/@banglabytex', icon: Youtube, color: 'bg-red-600' },
    { url: 'https://www.instagram.com/banglabytex', icon: Instagram, color: 'bg-gradient-to-r from-pink-500 to-orange-500' },
    { url: 'https://t.me/banglabytex', icon: Send, color: 'bg-sky-500' },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVerifying && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    } else if (timer === 0 && isVerifying) {
      onUnlock()
      setIsVerifying(false)
      setTimer(15)
    }
    return () => clearInterval(interval)
  }, [isVerifying, timer, onUnlock])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Free Limit Reached</h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          You have used your 3 free trials. Subscribe to our social channels to continue using the tools for free.
        </p>

        {!isVerifying ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium ${link.color} hover:opacity-90 transition`}
                >
                  <link.icon size={18} /> Subscribe
                </a>
              ))}
            </div>
            <button
              onClick={() => setIsVerifying(true)}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
            >
              I have Subscribed (Verify)
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl font-extrabold text-emerald-500 mb-2">{timer}s</div>
            <p className="text-sm text-slate-500">Verifying your subscription...</p>
          </div>
        )}

        <button onClick={onClose} className="mt-4 w-full text-slate-400 text-xs hover:text-slate-600">
          Cancel
        </button>
      </div>
    </div>
  )
}