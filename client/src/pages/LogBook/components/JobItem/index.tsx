import { Card, useModalStore } from '@lifeforge/ui'

import type { Job } from '@/pages/LogBook'

import JobDetailsModal from '@/pages/LogBook/components/JobDetailsModal'
import JobHeader from './components/JobHeader'
import JobStats from './components/JobStats'
import { JobItemProvider } from './contexts/JobItemContext'

function JobItem({ job }: { job: Job }) {
  const { open } = useModalStore()

  return (
    <JobItemProvider job={job}>
      <Card
        isInteractive
        gap="md"
        onClick={() => open(JobDetailsModal, { id: job.id })}
      >
        <JobHeader />
        <JobStats />
      </Card>
    </JobItemProvider>
  )
}

export default JobItem
