import { api } from '@/src/lib/api'
import { idem } from '@/src/lib/idempotency'
import type { DesignBrief } from '@/src/types/designs'

export async function analyzeDesignPlan(projectId: number, prompt: string, context?: Record<string, any>) {
  return api.post('/api/v1/design/plan', { project_id: projectId, prompt, context }, { 'Idempotency-Key': idem() })
}

export async function answerDesign(projectId: number, answers: Record<string, any>) {
  return api.post('/api/v1/design/answer', { project_id: projectId, answers })
}


