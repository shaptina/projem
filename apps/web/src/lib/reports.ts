import { api } from '@/lib/api'

export type JobLite = {
  id: number
  type: string
  status: 'queued' | 'running' | 'success' | 'failed'
  metrics?: { elapsed_ms?: number }
  created_at?: string
}

export type JobStats = {
  total: number
  successRate: number
  p50: number | null
  p95: number | null
  byType: Array<{ type: string; count: number }>
  byDay: Array<{ day: string; count: number }>
}

export async function buildJobStats(limit = 100, maxPages = 20): Promise<JobStats> {
  const all: JobLite[] = []
  for (let page = 0; page < maxPages; page++) {
    const off = page * limit
    const res = await api<{ items: JobLite[]; limit: number; offset: number }>(`/api/v1/jobs?limit=${limit}&offset=${off}`)
    all.push(...res.items)
    if (res.items.length < limit) break
  }
  const total = all.length
  const ok = all.filter((j) => j.status === 'success').length
  const successRate = total ? ok / total : 0
  const times = all.map((j) => (j.metrics as any)?.elapsed_ms).filter((x) => typeof x === 'number') as number[]
  times.sort((a, b) => a - b)
  const quantile = (p: number) => (times.length ? times[Math.min(times.length - 1, Math.floor(p * times.length))] : null)
  const p50 = quantile(0.5)
  const p95 = quantile(0.95)
  const byTypeMap = new Map<string, number>()
  for (const j of all) byTypeMap.set(j.type, (byTypeMap.get(j.type) || 0) + 1)
  const byType = Array.from(byTypeMap.entries()).map(([type, count]) => ({ type, count }))
  const byDayMap = new Map<string, number>()
  for (const j of all) {
    const d = j.created_at ? new Date(j.created_at) : null
    const key = d ? d.toISOString().slice(0, 10) : 'unknown'
    byDayMap.set(key, (byDayMap.get(key) || 0) + 1)
  }
  const byDay = Array.from(byDayMap.entries()).map(([day, count]) => ({ day, count }))
  return { total, successRate, p50, p95, byType, byDay }
}


