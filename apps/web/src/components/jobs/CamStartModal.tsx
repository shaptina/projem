'use client'
import { useState } from 'react'
import { createCamJob } from '@/src/lib/jobs'

export default function CamStartModal({ jobId }: { jobId: number }) {
  const [open, setOpen] = useState(false)
  const [postproc, setPostproc] = useState<'grbl' | 'marlin' | 'fanuc'>('grbl')
  const [feed, setFeed] = useState(600)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    try {
      setErr(null)
      const { job_id } = await createCamJob(jobId, { postproc, feed_mm_min: feed })
      window.location.href = `/jobs/${job_id}`
    } catch (e: any) {
      setErr(e.message || 'Hata')
    }
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-1 bg-blue-600 text-white rounded">CAM Başlat</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[420px]">
            <h3 className="text-lg font-semibold mb-2">CAM Başlat</h3>
            {err && <div className="mb-2 bg-red-100 text-red-700 p-2">{err}</div>}
            <label className="block mb-2">Post-Processor</label>
            <select value={postproc} onChange={(e) => setPostproc(e.target.value as any)} className="border rounded px-2 py-1 mb-2 w-full">
              <option value="grbl">GRBL</option>
              <option value="marlin">Marlin</option>
              <option value="fanuc">Fanuc</option>
            </select>
            <label className="block mb-2">Feed (mm/dk)</label>
            <input type="number" className="border rounded px-2 py-1 mb-4 w-full" value={feed} onChange={(e) => setFeed(+e.target.value)} min={1} />
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


