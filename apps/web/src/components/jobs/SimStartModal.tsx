'use client'
import { useState } from 'react'
import { createSimJob } from '@/lib/jobs'

export default function SimStartModal({ jobId }: { jobId: number }) {
  const [open, setOpen] = useState(false)
  const [res, setRes] = useState(1.2)
  const [quality, setQuality] = useState<'voxel' | 'occ-high'>('voxel')
  const [err, setErr] = useState<string | null>(null)
  const submit = async () => {
    try {
      setErr(null)
      const { job_id } = await createSimJob(jobId, { resolution_mm: res, quality })
      window.location.href = `/jobs/${job_id}`
    } catch (e: any) {
      setErr(e.message || 'Hata')
    }
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-1 bg-green-600 text-white rounded">Simülasyon Başlat</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[420px]">
            <h3 className="text-lg font-semibold mb-2">Simülasyon Başlat</h3>
            {err && <div className="mb-2 bg-red-100 text-red-700 p-2">{err}</div>}
            <label className="block mb-2">Çözünürlük (mm)</label>
            <input type="number" className="border rounded px-2 py-1 mb-2 w-full" value={res} onChange={(e) => setRes(+e.target.value)} min={0.1} step={0.1} />
            <label className="block mb-2">Kalite</label>
            <select value={quality} onChange={(e) => setQuality(e.target.value as any)} className="border rounded px-2 py-1 mb-4 w-full">
              <option value="voxel">Voxel</option>
              <option value="occ-high">OCC High</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={submit} className="px-3 py-1 bg-blue-600 text-white rounded">Gönder</button>
              <button onClick={() => setOpen(false)} className="px-3 py-1 border rounded">İptal</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


