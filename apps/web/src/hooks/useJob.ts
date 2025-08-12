'use client'
import { useQuery } from '@tanstack/react-query'
import type { Job } from './useJobs'

export function useJob(id: number) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  return useQuery<Job>({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await fetch(`${base}/api/v1/jobs/${id}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('İş alınamadı')
      return (await res.json()) as Job
    },
    refetchInterval: (q) => (q.state.data && q.state.data.status === 'running' ? 3000 : false),
  })
}


