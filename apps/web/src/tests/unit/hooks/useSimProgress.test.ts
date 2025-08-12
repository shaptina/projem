import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useSimProgress } from '@/hooks/useSimProgress'

class MockEventSource {
  url: string
  onmessage: ((this: EventSource, ev: MessageEvent) => any) | null = null
  onerror: ((this: EventSource, ev: Event) => any) | null = null
  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      this.onmessage?.({ data: JSON.stringify({ progress: 42, message: 'ileri' }) } as any)
    }, 0)
  }
  close() {}
}

describe('useSimProgress', () => {
  const originalES = global.EventSource
  beforeEach(() => {
    // @ts-ignore
    global.EventSource = MockEventSource
  })
  afterEach(() => {
    // @ts-ignore
    global.EventSource = originalES
  })

  test('SSE ile progress güncellenir', async () => {
    const { result } = renderHook(() => useSimProgress(99))
    await new Promise((r) => setTimeout(r, 10))
    expect(result.current.progress).toBe(42)
    expect(result.current.message).toBe('ileri')
  })
})


