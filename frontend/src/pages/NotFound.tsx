import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-8xl font-black text-slate-200">404</h1>
      <p className="mt-4 text-xl text-slate-600 font-medium">This tool or page doesn't exist yet.</p>
      <Link to="/" className="mt-8 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700">Back to Home</Link>
    </div>
  )
}