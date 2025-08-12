'use client'

import React from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Bir hata oluştu</h1>
      <p className="text-gray-700 mt-2">Beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.</p>
      <div className="text-sm text-gray-600 mt-2">{error.message}</div>
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 rounded bg-gray-200" onClick={() => reset()}>Tekrar dene</button>
        <a href="/" className="px-3 py-1 rounded bg-indigo-600 text-white">Ana sayfaya dön</a>
      </div>
    </div>
  )
}


