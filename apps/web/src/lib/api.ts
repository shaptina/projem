export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

function mapError(status: number, bodyText: string): Error {
  if (status === 429) return new Error('Hız sınırı aşıldı (429). Lütfen sonra tekrar deneyin.')
  if (status === 409) return new Error('Kuyruk duraklatılmış (409). Birazdan tekrar deneyin.')
  if (status === 403) return new Error('Yetkiniz yok (403).')
  const msg = bodyText || `İstek başarısız: ${status}`
  return new Error(msg)
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...(init || {}),
    cache: 'no-store',
    headers: finalHeaders,
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw mapError(res.status, txt)
  }
  return (await res.json()) as T
}

export function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(path, init)
}

api.get = <T,>(path: string) => apiFetch<T>(path)
api.post = <T,>(path: string, body: any, headers?: Record<string, string>) => {
  let finalBody: BodyInit
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    finalBody = body as FormData
  } else if (typeof body === 'string') {
    finalBody = body
  } else {
    finalBody = JSON.stringify(body)
  }
  return apiFetch<T>(path, { method: 'POST', body: finalBody, headers })
}


