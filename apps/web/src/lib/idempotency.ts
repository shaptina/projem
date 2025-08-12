export function idem(): string {
  try {
    const g: any = globalThis as any
    const fn = g?.crypto?.randomUUID
    if (typeof fn === 'function') return fn.call(g.crypto)
  } catch {}
  return Math.random().toString(36).slice(2)
}


