export type DesignBrief = {
  prompt: string
  targets?: { ratio?: number; power_kW?: number; torqueNm?: number }
  materials?: { gear?: string; housing?: string }
  standards?: string[]
  constraints?: string[]
}

export type DesignJobCreate = {
  brief: DesignBrief
  auto_clarify?: boolean
  chain?: { cam?: boolean; sim?: boolean }
}


