'use client'

import React, { useEffect, useState } from 'react'
import { fetchArtifacts } from '@/src/lib/artifacts'

type ArtefactRow = {
  job_id: number
  job_type: string
  created_at?: string
  type: string
  size?: number
  signed_url?: string | null
}

export default function DownloadsPage() {
  const [type, setType] = useState<string>('all')
  const [rows, setRows] = useState<ArtefactRow[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const list = await fetchArtifacts({ type: type === 'all' ? undefined : type })
      setRows(
        list.map((x) => ({
          job_id: x.job_id,
          job_type: x.job_type,
          created_at: x.created_at,
          type: x.artefact.type,
          size: x.artefact.size,
          signed_url: x.artefact.signed_url ?? null,
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [type])

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">İndirilenler</h1>
      <div className="flex items-end gap-3">
        <div>
          <label className="block text-xs text-gray-600">Tür</label>
          <select className="border p-1" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">Tümü</option>
            <option value="fcstd">fcstd</option>
            <option value="gcode">gcode</option>
            <option value="sim-mesh">sim-mesh</option>
            <option value="log">log</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div>Yükleniyor…</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">İş</th>
              <th className="p-2">Tür</th>
              <th className="p-2">Artefakt</th>
              <th className="p-2">Boyut</th>
              <th className="p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">#{r.job_id}</td>
                <td className="p-2">{r.job_type}</td>
                <td className="p-2">{r.type}</td>
                <td className="p-2">{r.size ?? '-'}</td>
                <td className="p-2 flex gap-2">
                  {r.signed_url ? (
                    <a href={r.signed_url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                      İndir
                    </a>
                  ) : (
                    <span className="text-gray-500">URL yok</span>
                  )}
                  {r.signed_url && (
                    <button
                      className="text-gray-700 underline"
                      onClick={() => navigator.clipboard.writeText(r.signed_url!)}
                    >
                      URL’yi kopyala
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}


