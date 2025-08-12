import { api } from '@/src/lib/api'

type JobLite = {
  id: number
  type: string
  created_at?: string
  artefacts?: Array<{ type: string; s3_key?: string; signed_url?: string; size?: number }>
}

export async function fetchArtifacts(params: { limit?: number; maxPages?: number; type?: string } = {}) {
  const limit = params.limit ?? 50
  const maxPages = params.maxPages ?? 10
  const items: Array<{ job_id: number; job_type: string; created_at?: string; artefact: any }> = []
  for (let page = 0; page < maxPages; page++) {
    const off = page * limit
    const res = await api<{ items: JobLite[]; limit: number; offset: number }>(`/api/v1/jobs?limit=${limit}&offset=${off}`)
    for (const j of res.items) {
      for (const a of j.artefacts || []) {
        if (params.type && a.type !== params.type) continue
        items.push({ job_id: j.id, job_type: j.type, created_at: (j as any).created_at, artefact: a })
      }
    }
    if (res.items.length < limit) break
  }
  return items
}


