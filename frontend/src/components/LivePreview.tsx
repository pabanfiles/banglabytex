import { useState } from 'react'

export default function LivePreview({ file, action }: { file: File | null, action: string }) {
  if (!file) return null
  const size = (file.size / 1024 / 1024).toFixed(2)
  
  return (
    <div className="bg-[#FFF7ED] dark:bg-slate-800 border border-[#FFEDD5] dark:border-slate-700 rounded-xl p-4 mt-4">
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
        <span>Original Size:</span> <b>{size} MB</b>
      </div>
      <div className="flex justify-between text-sm text-emerald-600 font-bold">
        <span>Estimated {action} Size:</span> <b>~{(parseFloat(size) * 0.6).toFixed(2)} MB</b>
      </div>
    </div>
  )
}