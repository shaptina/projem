import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { beforeAll, afterAll, test, expect } from 'vitest'
import { server } from '@/src/tests/testServer'
import { http, HttpResponse } from 'msw'
import { AssemblyForm } from '@/src/components/forms/AssemblyForm'

let seenIdemp: string | null = null

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'
  server.use(
    http.post('http://localhost:8000/api/v1/assemblies', async ({ request }) => {
      // @ts-ignore
      seenIdemp = request.headers.get('Idempotency-Key')
      return HttpResponse.json({ job_id: 42 })
    }),
  )
})
afterAll(() => server.resetHandlers())

test('geçerli input → POST + Idempotency-Key var → yönlendirme', async () => {
  // window.location yönlendirme için stub
  // @ts-ignore
  delete window.location
  // @ts-ignore
  window.location = { href: '' }

  render(<AssemblyForm />)

  // Form alanları (bileşendeki label metinlerine göre)
  fireEvent.change(screen.getByLabelText(/Toplam Oran/i), { target: { value: '3.16' } })
  fireEvent.change(screen.getByLabelText(/Güç \(kW\)/i), { target: { value: '1' } })
  fireEvent.change(screen.getByLabelText(/Kademe Oranları/i), { target: { value: '3.16' } })

  fireEvent.click(screen.getByRole('button', { name: /Gönder/i }))

  await waitFor(() => expect(seenIdemp).toBeTruthy())
  // @ts-ignore
  expect(window.location.href).toMatch(/\/jobs\/42$/)
})


