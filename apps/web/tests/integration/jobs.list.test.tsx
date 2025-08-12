import { render, screen } from '@testing-library/react'
import JobsPage from '@/src/app/jobs/page'
import { test, expect } from 'vitest'

test('jobs listesi render', async () => {
  render(<JobsPage />)
  expect(await screen.findByText(/İşler/i)).toBeTruthy()
})


