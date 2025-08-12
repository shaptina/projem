'use client'
import { useQuery } from '@tanstack/react-query'

export type Job = {
  id: number
  type: string
  status: string
  started_at?: string | null
  finished_at?: string | null
  metrics?: Record<string, unknown> | null
  artefacts?: Array<{ type: string; signed_url?: string; s3_key?: string; size?: number }> | null
}

type JobsResp = { items: Job[]; limit: number; offset: number }

export type JobsParams = {
  q?: string
  type?: 'assembly' | 'cam' | 'sim' | 'all'
  status?: 'queued' | 'running' | 'success' | 'failed' | 'all'
  from?: string
  to?: string
  limit?: number
  offset?: number
}

function buildQuery(params: JobsParams): string {
  const sp = new URLSearchParams()
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.offset != null) sp.set('offset', String(params.offset))
  if (params.type && params.type !== 'all') sp.set('type', params.type)
  if (params.status && params.status !== 'all') sp.set('status', params.status)
  if (params.q) sp.set('q', params.q)
  if (params.from) sp.set('from', params.from)
  if (params.to) sp.set('to', params.to)
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

export function useJobs(params: JobsParams = { limit: 20, offset: 0 }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  return useQuery<JobsResp>({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const qs = buildQuery(params)
      const res = await fetch(`${base}/api/v1/jobs${qs}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('İş listesi alınamadı')
      return (await res.json()) as JobsResp
    },
    refetchInterval: 5000,
  })
}


