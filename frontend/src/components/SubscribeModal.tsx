import { useState, useEffect } from 'react'
import { Facebook, Youtube, Instagram, Send, Lock, CheckCircle2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onUnlock: () => void
}

export default function SubscribeModal({ isOpen, onClose, onUnlock }: Props) {
  const [timer, setTimer] = useState(10)
  const [isVerifying, setIsVerifying] = useState(false)

  const links = [
    { name: 'Facebook', url: 'https://www.facebook.com/ppmcreator', icon: Facebook, color: 'bg-blue-600' },
    { name: 'YouTube', url: 'https://www.youtube.com/@ppmcreator', icon: Youtube, color: 'bg-red-600' },
    { name: 'Instagram', url: 'https://www.instagram.com/ppmcreator', icon: Instagram, color: 'bg-gradient-to-r from-pink-500 to-orange-500' },
    { name: 'Telegram', url: 'https://t.me/ppmcreator', icon: Send, color: 'bg-sky-500' },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVerifying && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    } else if (timer === 0 && isVerifying) {
      onUnlock() // লিমিট রিসেট হবে
      setIsVerifying(false)
      setTimer(10)
    }
    return () => clearInterval(interval)
  }, [isVerifying, timer, onUnlock])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
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
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-white font-medium ${link.color} hover:opacity-90 transition shadow-md`}
                >
                  <link.icon size={20} /> 
                  <span className="text-xs">Subscribe</span>
                </a>
              ))}
            </div>
            
            <button
              onClick={() => setIsVerifying(true)}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} /> I have Subscribed
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              Click the button above after subscribing to unlock access.
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl font-extrabold text-emerald-500 mb-3">{timer}s</div>
            <p className="text-sm text-slate-500">Verifying your subscription...</p>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${((10 - timer) / 10) * 100}%` }}></div>
            </div>
          </div>
        )}

        <button onClick={onClose} className="mt-6 w-full text-slate-400 text-xs hover:text-slate-600">
          Cancel (No thanks)
        </button>
      </div>
    </div>
  )
}