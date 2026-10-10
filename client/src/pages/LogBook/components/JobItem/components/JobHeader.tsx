import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, TagChip } from '@lifeforge/ui'

import { STATUS_COLORS, STATUS_ICONS } from '@/constants/jobMeta'

import { useJobItemContext } from '../contexts/JobItemContext'
import JobSummary from './JobSummary'

function JobHeader() {
  const job = useJobItemContext()
  const { t } = useModuleTranslation()

  return (
    <Flex align="start" gap="md" justify="between" width="100%">
      <JobSummary />
      <Flex align="center" flexShrink="0" gap="sm" wrap="wrap">
        <TagChip
          color={STATUS_COLORS[job.status]}
          icon={STATUS_ICONS[job.status]}
          label={t(`jobs.status.${job.status}`)}
        />
      </Flex>
    </Flex>
  )
}

export default JobHeader
