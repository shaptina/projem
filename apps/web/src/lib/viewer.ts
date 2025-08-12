import { api } from '@/src/lib/api'
import type { Job, ArtefactRef } from '@/src/types/jobs'

export async function fetchJob(jobId: number): Promise<Job> {
  return api.get<Job>(`/api/v1/jobs/${jobId}`)
}

export function pickArtifact(
  job: Job | null | undefined,
  type: 'sim-mesh' | 'gcode' | 'fcstd',
): ArtefactRef | undefined {
  if (!job || !job.artefacts || job.artefacts.length === 0) return undefined
  return job.artefacts.find((a) => a.type === type)
}


