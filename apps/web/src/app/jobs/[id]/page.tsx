'use client'
import { useJob } from '@/src/hooks/useJob'
import CamStartModal from '@/src/components/jobs/CamStartModal'
import SimStartModal from '@/src/components/jobs/SimStartModal'
import type { Job, ArtefactRef } from '@/src/types/jobs'

export default function JobDetail({ params: { id } }: { params: { id: string } }) {
  const jobId = Number(id)
  const { data, isLoading, error } = useJob(jobId)

  if (isLoading) return <div>Yükleniyor…</div>
  if (error) return <div>Hata: {(error as any)?.message || 'Bilinmeyen hata'}</div>

  const j = data as Job
  const artefacts = (j.artefacts ?? []) as ArtefactRef[]
  const hasGcode = artefacts.some((a) => a.type === 'gcode')
  const hasSimMesh = artefacts.some((a) => a.type === 'sim-mesh')
  const isAssembly = j.type === 'assembly'

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">İş #{j.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <div>
            <b>Tür:</b> {j.type}
          </div>
          <div>
            <b>Durum:</b> {j.status}
          </div>
          <div>
            <b>Kuyruk:</b> {j.queue}
          </div>
          <div>
            <b>Oluşturma:</b> {new Date(j.created_at).toLocaleString('tr-TR')}
          </div>
          <div>
            <b>Süre (ms):</b> {(j.metrics as any)?.elapsed_ms ?? '-'}
          </div>
          {j.error_message && (
            <div className="text-red-600 mt-2">
              <b>Hata:</b> {j.error_message}
            </div>
          )}
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Artefaktlar</h3>
          {artefacts.length === 0 ? (
            <div>Henüz artefakt yok.</div>
          ) : (
            <ul className="space-y-2">
              {artefacts.map((a, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    {a.type} {a.size ? `(${a.size} bayt)` : ''}
                  </span>
                  <a className="text-blue-600 underline" href={a.signed_url} target="_blank" rel="noreferrer">
                    İndir
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {isAssembly && !hasGcode && <CamStartModal jobId={jobId} />}
        {hasGcode && <SimStartModal jobId={jobId} />}
        <a
          className={`px-3 py-1 rounded ${hasSimMesh ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          href={hasSimMesh ? `/viewer?jobId=${jobId}` : undefined}
          aria-disabled={!hasSimMesh}
          title={hasSimMesh ? 'Görüntüle' : 'Önce simülasyon üretin.'}
          onClick={(e) => {
            if (!hasSimMesh) e.preventDefault()
          }}
        >
          Görüntüle
        </a>
      </div>
    </div>
  )
}


