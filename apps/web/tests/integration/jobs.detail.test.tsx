import { render, screen } from '@testing-library/react'
import JobDetail from '@/src/app/jobs/[id]/page'
import { test, expect } from 'vitest'

test('job detay artefaktları listeler', async () => {
  render(<JobDetail params={{ id: '1' }} />)
  expect(await screen.findByText(/Artefaktlar/i)).toBeTruthy()
  expect(screen.getByRole('link', { name: /İndir/i })).toBeTruthy()
})


