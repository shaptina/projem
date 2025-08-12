'use client'
import React, { useState } from 'react'
import { useJobs, type JobsParams } from '@/src/hooks/useJobs'
import { JobTable } from '@/src/components/jobs/JobTable'
import { JobFilters } from '@/src/components/jobs/JobFilters'

export default function JobsPage() {
  const [params, setParams] = useState<JobsParams>({ limit: 20, offset: 0, type: 'all', status: 'all' })
  const { data, isLoading, error } = useJobs(params)
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">İşler</h1>
      <JobFilters value={params} onChange={setParams} />
      {error && <div className="bg-red-100 text-red-700 p-2">{(error as any).message}</div>}
      <JobTable items={data?.items || []} loading={isLoading} />
    </main>
  )
}


