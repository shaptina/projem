import { api } from './api'
import { idem } from './idempotency'

export async function createCamJob(
  sourceJobId: number,
  params: { postproc: 'grbl' | 'marlin' | 'fanuc'; feed_mm_min: number },
) {
  // Backend beklenen şema: { assembly_job_id, post, feed_mm_min, ... }
  const body = {
    assembly_job_id: sourceJobId,
    post: params.postproc,
    feed_mm_min: params.feed_mm_min,
  }
  return api.post<{ job_id: number }>(
    '/api/v1/cam/gcode',
    body,
    { 'Idempotency-Key': idem() },
  )
}

export async function createSimJob(
  sourceJobId: number,
  params: { resolution_mm: number; quality: 'voxel' | 'occ-high' },
) {
  // Backend beklenen şema ve yol: POST /api/v1/sim/simulate
  const body = {
    assembly_job_id: sourceJobId,
    resolution_mm: params.resolution_mm,
    method: params.quality,
  }
  return api.post<{ job_id: number }>(
    '/api/v1/sim/simulate',
    body,
    { 'Idempotency-Key': idem() },
  )
}


