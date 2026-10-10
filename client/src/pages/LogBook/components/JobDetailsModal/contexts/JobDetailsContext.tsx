import { createContext, useContext } from 'react'

import type { Job } from '@/pages/LogBook'

const JobDetailsContext = createContext<Job | null>(null)

const JobDetailsCloseContext = createContext<(() => void) | null>(null)

export function JobDetailsProvider({
  job,
  onClose,
  children
}: {
  job: Job
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <JobDetailsContext value={job}>
      <JobDetailsCloseContext value={onClose}>
        {children}
      </JobDetailsCloseContext>
    </JobDetailsContext>
  )
}

export function useJobDetails() {
  const ctx = useContext(JobDetailsContext)

  if (!ctx) {
    throw new Error('useJobDetails must be used within JobDetailsProvider')
  }

  return ctx
}

export function useCloseJobDetailsModal() {
  const ctx = useContext(JobDetailsCloseContext)

  if (!ctx) {
    throw new Error(
      'useCloseJobDetailsModal must be used within JobDetailsProvider'
    )
  }

  return ctx
}
