'use client'

import React, { useEffect, useState } from 'react'
import { buildJobStats, type JobStats } from '@/lib/reports'

export default function ReportsPage() {
  const [stats, setStats] = useState<JobStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    buildJobStats().then((s) => setStats(s)).finally(() => setLoading(false))
  }, [])

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Raporlar</h1>
      {loading && <div>Yükleniyor…</div>}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border rounded p-3">
              <div className="text-xs text-gray-600">Toplam</div>
              <div className="text-xl font-semibold">{stats.total}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-gray-600">Başarı Oranı</div>
              <div className="text-xl font-semibold">{(stats.successRate * 100).toFixed(1)}%</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-gray-600">p50 (ms)</div>
              <div className="text-xl font-semibold">{stats.p50 ?? '-'}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-gray-600">p95 (ms)</div>
              <div className="text-xl font-semibold">{stats.p95 ?? '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-3">
              <h3 className="font-medium mb-2">Türlere Göre</h3>
              <ul>
                {stats.byType.map((x) => (
                  <li key={x.type} className="flex justify-between border-b py-1">
                    <span>{x.type}</span>
                    <span>{x.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border rounded p-3">
              <h3 className="font-medium mb-2">Gün Bazında</h3>
              <ul>
                {stats.byDay.map((x) => (
                  <li key={x.day} className="flex justify-between border-b py-1">
                    <span>{x.day}</span>
                    <span>{x.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </main>
  )
}


