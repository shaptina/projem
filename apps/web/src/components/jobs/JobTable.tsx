import type { Job } from '@/hooks/useJobs'

export function JobTable({ items, loading }: { items: Job[]; loading?: boolean }) {
  if (loading) return <div className="animate-pulse text-gray-500">Yükleniyor…</div>
  if (!items.length) return <div className="text-gray-600">Kayıt yok.</div>
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-50 text-left">
          <th className="p-2">ID</th>
          <th className="p-2">Tip</th>
          <th className="p-2">Durum</th>
          <th className="p-2">Oluşturma</th>
          <th className="p-2">Süre (ms)</th>
          <th className="p-2">İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {items.map((j) => (
          <tr key={j.id} className="border-t">
            <td className="p-2">#{j.id}</td>
            <td className="p-2">{j.type}</td>
            <td className="p-2">
              {(() => {
                const colorBy = {
                  queued: 'bg-gray-200 text-gray-800',
                  running: 'bg-blue-200 text-blue-800',
                  success: 'bg-green-200 text-green-800',
                  failed: 'bg-red-200 text-red-800',
                } as const
                const cls = colorBy[(j.status as keyof typeof colorBy) ?? 'queued']
                return <span className={`inline-block px-2 py-0.5 rounded ${cls}`}>{j.status}</span>
              })()}
            </td>
            <td className="p-2">{j.started_at ? new Date(j.started_at).toLocaleString('tr-TR') : '-'}</td>
            <td className="p-2">{(j.metrics as any)?.elapsed_ms ?? '-'}</td>
            <td className="p-2">
              <a className="text-blue-600 hover:underline" href={`/jobs/${j.id}`}>Detaya git</a>
              {j.artefacts?.some(a => a.type === 'sim-mesh') && (
                <a className="ml-3 text-indigo-600 hover:underline" href={`/viewer?jobId=${j.id}`}>Görüntüle</a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


