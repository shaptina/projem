import { afterEach, beforeAll, afterAll, expect, test } from 'vitest'
import { server } from '@/src/tests/testServer'
import { http, HttpResponse } from 'msw'
import { api } from '@/src/lib/api'

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('429 → TR mesajı', async () => {
  server.use(http.get('http://localhost:8000/boom', () => new HttpResponse(null, { status: 429 })))
  await expect(api('/boom')).rejects.toThrow(/Hız sınırı aşıldı/i)
})

test('409 → TR mesajı', async () => {
  server.use(http.get('http://localhost:8000/boom', () => new HttpResponse(null, { status: 409 })))
  await expect(api('/boom')).rejects.toThrow(/Kuyruk duraklatılmış/i)
})

test('403 → TR mesajı', async () => {
  server.use(http.get('http://localhost:8000/boom', () => new HttpResponse(null, { status: 403 })))
  await expect(api('/boom')).rejects.toThrow(/Yetkiniz yok/i)
})


