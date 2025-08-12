'use client'

import React, { useEffect, useState } from 'react'

type UiPrefs = {
  refreshJobsMs: number
  refreshJobDetailMs: number
  theme: 'light' | 'dark'
  showDevBanner: boolean
}

const defaultPrefs: UiPrefs = {
  refreshJobsMs: 5000,
  refreshJobDetailMs: 3000,
  theme: 'light',
  showDevBanner: true,
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UiPrefs>(defaultPrefs)

  useEffect(() => {
    try {
      const s = localStorage.getItem('ui_prefs')
      if (s) setPrefs({ ...defaultPrefs, ...(JSON.parse(s) as UiPrefs) })
    } catch {}
  }, [])

  function save() {
    localStorage.setItem('ui_prefs', JSON.stringify(prefs))
    alert('Kaydedildi')
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ayarlar</h1>
      <div className="grid gap-3 max-w-xl">
        <label className="flex items-center justify-between border p-2 rounded">
          <span>İş listesi yenileme (ms)</span>
          <input type="number" className="border p-1" value={prefs.refreshJobsMs} onChange={(e) => setPrefs({ ...prefs, refreshJobsMs: Number(e.target.value) })} />
        </label>
        <label className="flex items-center justify-between border p-2 rounded">
          <span>İş detay yenileme (ms)</span>
          <input type="number" className="border p-1" value={prefs.refreshJobDetailMs} onChange={(e) => setPrefs({ ...prefs, refreshJobDetailMs: Number(e.target.value) })} />
        </label>
        <label className="flex items-center justify-between border p-2 rounded">
          <span>Tema</span>
          <select className="border p-1" value={prefs.theme} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value as any })}>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        <label className="flex items-center justify-between border p-2 rounded">
          <span>Geliştirici banner’ı</span>
          <input type="checkbox" checked={prefs.showDevBanner} onChange={(e) => setPrefs({ ...prefs, showDevBanner: e.target.checked })} />
        </label>
        <div>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={save}>Kaydet</button>
        </div>
      </div>
    </main>
  )
}


