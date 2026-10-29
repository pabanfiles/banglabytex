import { ShieldAlert } from 'lucide-react'

export default function GlobalDisclaimer() {
  return (
    <div className="bg-amber-50 border-t border-amber-200 mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-amber-700 font-semibold mb-2">
          <ShieldAlert size={18} /> Legal Disclaimer
        </div>
        <p className="text-sm text-amber-800 max-w-4xl mx-auto">
          PPM Creator Tools does not host, store, or distribute any copyrighted media. All files are fetched directly from third-party platforms. 
          Users are solely responsible for their actions. Downloading copyrighted material without permission may be illegal in your country. 
          If you are a copyright owner, please contact <strong>support@ppmcreator.com</strong> for immediate removal.
        </p>
      </div>
    </div>
  )
}