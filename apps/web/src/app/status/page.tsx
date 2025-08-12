'use client'

import React, { useEffect, useState } from 'react'

type Hz = { db: string; redis: string; s3: string }

export default function StatusPage() {
  const [ok, setOk] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hz, setHz] = useState<Hz | null>(null)

  async function load() {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/healthz`, { cache: 'no-store' })
      setOk(r.ok)
      try { setHz(await r.json()) } catch {}
    } catch (e: any) {
      setOk(false)
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Durum</h1>
      <div>
        <span className={`px-2 py-1 rounded ${ok ? 'bg-green-200 text-green-800' : ok === false ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
          {ok === null ? 'Yükleniyor' : ok ? 'OK' : 'FAIL'}
        </span>
        {error && <span className="ml-2 text-red-700">{error}</span>}
      </div>
      <div className="text-sm text-gray-700">
        <div>Prometheus: <a className="text-indigo-600 underline" href="http://localhost:9090" target="_blank" rel="noreferrer">aç</a></div>
        <div>Grafana: <a className="text-indigo-600 underline" href="http://localhost:3001" target="_blank" rel="noreferrer">aç</a></div>
      </div>
    </main>
  )
}


