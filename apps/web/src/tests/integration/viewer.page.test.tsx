import { render, screen } from '@testing-library/react'
import ViewerPage from '@/src/app/viewer/page'
import { test, expect } from 'vitest'

test('artefakt yoksa bilgilendirme mesajı', async () => {
  // URL paramı simüle etmek için jsdom konumunu ayarla
  const url = new URL('http://localhost/viewer?jobId=1')
  Object.defineProperty(window, 'location', { value: url, writable: true } as any)

  render(<ViewerPage />)
  expect(await screen.findByText(/Bu işte simülasyon mesh artefaktı yok/i)).toBeTruthy()
})


