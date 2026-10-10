import { type ReactNode, createContext, useContext } from 'react'

import type { Job } from '@/pages/LogBook'

const JobItemContext = createContext<Job | null>(null)

export function JobItemProvider({
  job,
  children
}: {
  job: Job
  children: ReactNode
}) {
  return <JobItemContext value={job}>{children}</JobItemContext>
}

export function useJobItemContext() {
  const context = useContext(JobItemContext)

  if (!context) {
    throw new Error('useJobItemContext must be used within a JobItemProvider')
  }

  return context
}
