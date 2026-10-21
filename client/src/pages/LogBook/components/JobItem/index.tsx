import type { CSSProperties } from 'react'

import { Box, Card, useModalStore } from '@lifeforge/ui'

import type { Job } from '@/pages/LogBook'
import JobDetailsModal from '@/pages/LogBook/components/JobDetailsModal'

import JobHeader from './components/JobHeader'
import JobStats from './components/JobStats'
import { JobItemProvider } from './contexts/JobItemContext'

/** Red/white hazard stripes used by the game for special transport cargo. */
const HAZARD_STRIPES: CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(135deg, #dc2626 0 4px, #ffffff 4px 8px)'
}

function JobItem({
  job,
  showDetails = true
}: {
  job: Job
  showDetails?: boolean
}) {
  const { open } = useModalStore()

  return (
    <JobItemProvider job={job}>
      <Card
        isInteractive
        gap="md"
        style={{
          paddingLeft: job.special_job ? 'calc(var(--spacing) * 10)' : undefined
        }}
        onClick={() => open(JobDetailsModal, { id: job.id })}
      >
        {job.special_job && (
          <Box
            bottom="calc(var(--spacing) * 4)"
            left="calc(var(--spacing) * 4)"
            position="absolute"
            r="full"
            style={HAZARD_STRIPES}
            top="calc(var(--spacing) * 4)"
            width="0.4rem"
          />
        )}
        <JobHeader />
        {showDetails && <JobStats />}
      </Card>
    </JobItemProvider>
  )
}

export default JobItem
