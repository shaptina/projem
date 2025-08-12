'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Viewer3D } from '@/components/viewer/Viewer3D'
import { fetchJob, pickArtifact } from '@/lib/viewer'
import { parseGcode } from '@/lib/gcode'
import { getMachineBounds } from '@/lib/config'
import type { Job } from '@/types/jobs'
import { useSimProgress } from '@/hooks/useSimProgress'

export default function ViewerPage() {
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const jobIdStr = search.get('jobId')
  const jobId = jobIdStr ? Number(jobIdStr) : null

  const [job, setJob] = useState<Job | null>(null)
  const [gcode, setGcode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [units, setUnits] = useState<'mm' | 'inch' | 'unknown'>('unknown')
  const [showSim, setShowSim] = useState(true)

  const { progress, message } = useSimProgress(jobId ?? undefined)

  useEffect(() => {
    if (!jobId) return
    ;(async () => {
      try {
        const j = await fetchJob(jobId)
        setJob(j)
        const g = pickArtifact(j, 'gcode')?.signed_url
        if (g) {
          const gr = await fetch(g)
          if (!gr.ok) throw new Error('G-code indirilemedi. İmzalı URL süresi dolmuş olabilir.')
          const txt = await gr.text()
          setGcode(txt)
          const parsed = parseGcode(txt)
          setUnits(parsed.units)
        }
      } catch (e: any) {
        setError(e.message || 'Hata')
      }
    })()
  }, [jobId])

  const parsed = useMemo(() => (gcode ? parseGcode(gcode) : null), [gcode])
  const bounds = useMemo(() => getMachineBounds(), [])

  const simUrl = showSim ? pickArtifact(job, 'sim-mesh')?.signed_url : undefined

  return (
    <main className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Görüntüleyici</div>
          <div className="text-sm text-gray-600">İş #{jobId ?? '-'} — Birimler: {units}</div>
        </div>
        {gcode && (
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(gcode)}`} download={`job-${jobId}.nc`} className="px-3 py-1 bg-blue-600 text-white rounded">
            G-code indir
          </a>
        )}
      </div>

      {error && <div className="p-2 bg-red-100 text-red-700">{error}</div>}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showSim} onChange={(e) => setShowSim(e.target.checked)} /> Simülasyon Mesh
        </label>
        {progress > 0 && progress < 100 && (
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-gray-600">İlerleme: {progress.toFixed(0)}% {message ? `— ${message}` : ''}</div>
          </div>
        )}
      </div>

      {simUrl ? (
        <Viewer3D meshUrl={simUrl} />
      ) : (
        <div className="p-3 border rounded text-gray-700">
          Bu işte simülasyon mesh artefaktı yok. İşlem tamamlandığında burada görünecek.
        </div>
      )}
    </main>
  )
}




