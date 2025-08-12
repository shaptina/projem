export type ArtefactRef = {
  type: 'fcstd' | 'gcode' | 'sim-mesh' | 'log'
  signed_url: string
  size?: number
  sha256?: string
}

export type JobStatus = 'queued' | 'running' | 'success' | 'failed'

export type Job = {
  id: number
  type: 'assembly' | 'cam' | 'sim'
  queue: 'freecad' | 'cpu' | 'postproc' | 'sim'
  status: JobStatus
  error_code?: string | null
  error_message?: string | null
  created_at: string
  started_at?: string | null
  finished_at?: string | null
  metrics?: Record<string, number | string>
  artefacts?: ArtefactRef[]
}


