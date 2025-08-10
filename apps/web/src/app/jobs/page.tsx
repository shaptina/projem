'use client';
import React, { useEffect, useState } from 'react';

type JobItem = {
  id: number;
  type: string;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  metrics?: Record<string, unknown> | null;
};

export default function JobsPage() {
  const [items, setItems] = useState<JobItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resOpen, setResOpen] = useState<number | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${apiBase}/api/v1/jobs?limit=50`).then(async (r) => {
      if (!r.ok) throw new Error('İş listesi alınamadı');
      const data = await r.json();
      setItems(data.items || []);
    }).catch((e) => setError(e.message));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">İş Durumu</h1>
      {error && <div className="mt-2 bg-red-100 text-red-700 p-2">{error}</div>}
      <div className="mt-4 grid gap-3">
        {items.map((j) => (
          <div key={j.id} className="border p-3 rounded hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <a href={`/viewer?jobId=${j.id}`} className="font-semibold">#{j.id} — {j.type} — {j.status}</a>
              {j.type === 'assembly' && (
                <button onClick={() => setResOpen(j.id)} className="px-3 py-1 bg-green-600 text-white rounded">Simülasyon Başlat</button>
              )}
            </div>
            <div className="text-sm text-gray-600">Başlangıç: {j.started_at || '-'}</div>
            <div className="text-sm text-gray-600">Bitiş: {j.finished_at || '-'}</div>
          </div>
        ))}
      </div>

      {resOpen && (
        <SimModal jobId={resOpen} onClose={() => setResOpen(null)} apiBase={apiBase} />
      )}
    </main>
  );
}

function SimModal({ jobId, apiBase, onClose }: { jobId: number; apiBase: string; onClose: () => void }) {
  const [resolution, setResolution] = useState(0.8);
  const [method, setMethod] = useState<'voxel' | 'occ-high'>('voxel');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function startSim() {
    try {
      setLoading(true);
      setErr(null);
      const body = { assembly_job_id: jobId, resolution_mm: resolution, method };
      const r = await fetch(`${apiBase}/api/v1/sim/simulate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error('Simülasyon başlatılamadı');
      const data = await r.json();
      window.location.href = `/viewer?jobId=${data.job_id}`;
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-[420px]">
        <div className="text-lg font-semibold mb-2">Simülasyon Başlat</div>
        {err && <div className="mb-2 bg-red-100 text-red-700 p-2">{err}</div>}
        <div className="mb-3">
          <label className="block text-sm text-gray-700">Çözünürlük (mm)</label>
          <input type="number" step="0.1" min={0.1} value={resolution} onChange={e => setResolution(parseFloat(e.target.value))} className="border rounded px-2 py-1 w-full" />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-700">Yöntem</label>
          <select value={method} onChange={e => setMethod(e.target.value as any)} className="border rounded px-2 py-1 w-full">
            <option value="voxel">voxel (hızlı)</option>
            <option value="occ-high">occ-high (yüksek doğruluk)</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">İptal</button>
          <button onClick={startSim} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Başlatılıyor…' : 'Başlat'}</button>
        </div>
      </div>
    </div>
  );
}


