'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { JobsParams } from '@/src/hooks/useJobs'

type SavedView = { name: string; params: JobsParams }

function loadSaved(): SavedView[] {
  if (typeof window === 'undefined') return []
  try {
    const s = localStorage.getItem('jobs_saved_views')
    return s ? (JSON.parse(s) as SavedView[]) : []
  } catch {
    return []
  }
}

function saveAll(list: SavedView[]) {
  localStorage.setItem('jobs_saved_views', JSON.stringify(list))
}

export function JobFilters({ value, onChange }: { value: JobsParams; onChange: (v: JobsParams) => void }) {
  const [local, setLocal] = useState<JobsParams>(value)
  const [saved, setSaved] = useState<SavedView[]>([])
  const [pick, setPick] = useState<string>('')

  useEffect(() => setSaved(loadSaved()), [])
  useEffect(() => setLocal(value), [value])

  function apply() {
    onChange(local)
  }

  function saveView() {
    const name = prompt('Görünüm adı')
    if (!name) return
    const list = [...saved.filter((s) => s.name !== name), { name, params: local }]
    setSaved(list)
    saveAll(list)
  }

  function loadView(name: string) {
    const v = saved.find((s) => s.name === name)
    if (v) onChange(v.params)
  }

  return (
    <div className="flex flex-wrap items-end gap-3 p-3 border rounded">
      <div>
        <label className="block text-xs text-gray-600">Tip</label>
        <select className="border p-1" value={local.type || 'all'} onChange={(e) => setLocal({ ...local, type: e.target.value as any })}>
          <option value="all">Tümü</option>
          <option value="assembly">assembly</option>
          <option value="cam">cam</option>
          <option value="sim">sim</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600">Durum</label>
        <select className="border p-1" value={local.status || 'all'} onChange={(e) => setLocal({ ...local, status: e.target.value as any })}>
          <option value="all">Tümü</option>
          <option value="queued">queued</option>
          <option value="running">running</option>
          <option value="success">success</option>
          <option value="failed">failed</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600">Arama</label>
        <input className="border p-1" value={local.q || ''} onChange={(e) => setLocal({ ...local, q: e.target.value })} placeholder="ID, kullanıcı..." />
      </div>
      <div>
        <label className="block text-xs text-gray-600">Başlangıç</label>
        <input type="date" className="border p-1" value={local.from || ''} onChange={(e) => setLocal({ ...local, from: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs text-gray-600">Bitiş</label>
        <input type="date" className="border p-1" value={local.to || ''} onChange={(e) => setLocal({ ...local, to: e.target.value })} />
      </div>
      <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={apply}>Uygula</button>
      <button className="px-3 py-1 rounded bg-gray-200" onClick={saveView}>Görünümü Kaydet</button>
      <div className="ml-auto flex items-center gap-2">
        <label className="text-sm">Kaydedilmiş:</label>
        <select className="border p-1" value={pick} onChange={(e) => { setPick(e.target.value); loadView(e.target.value) }}>
          <option value="">Seçin</option>
          {saved.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}


