'use client'

import { useEffect, useRef, useState } from 'react'

type SimEvent = {
  progress?: number
  message?: string
  stage?: string
}

export function useSimProgress(jobId: number | null | undefined) {
  const [progress, setProgress] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!jobId) return
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/sim/${jobId}/events`
    const es = new EventSource(url)
    esRef.current = es
    setConnected(true)
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as SimEvent
        if (typeof data.progress === 'number') setProgress(data.progress)
        if (data.message) setMessage(data.message)
        else if (data.stage) setMessage(data.stage)
      } catch {
        // ignore parse errors
      }
    }
    es.onerror = () => {
      setConnected(false)
      es.close()
    }
    return () => {
      es.close()
    }
  }, [jobId])

  return { progress, message, connected }
}


