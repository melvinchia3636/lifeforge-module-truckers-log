import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Flex, TagChip, Text } from '@lifeforge/ui'
import { useEffect, useRef, useState } from 'react'

import CargoPreview from '@/pages/LogBook/components/CargoPreview'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'

function CargoSection() {
  const job = useJobDetails()
  const { t } = useModuleTranslation()
  const contentRef = useRef<HTMLElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const observer = new ResizeObserver(entries => {
      const height = entries[0]?.contentRect.height

      if (height !== undefined) {
        setContentHeight(height)
      }
    })

    observer.observe(element)
    setContentHeight(element.getBoundingClientRect().height)

    return () => observer.disconnect()
  }, [])

  const tonnage =
    job.cargo_mass_kg > 0 ? `${(job.cargo_mass_kg / 1000).toFixed(1)} t` : null

  const rows = [
    {
      icon: 'tabler:package',
      label: 'cargo',
      children: (
        <Text align={{ sm: 'right' }}>
          {job.cargo || t('jobs.unknownCargo')}
          {tonnage ? ` (${tonnage})` : ''}
        </Text>
      )
    },
    job.unit_count > 0 && {
      icon: 'tabler:stack-2',
      label: 'units',
      children: (
        <Text align={{ sm: 'right' }}>
          {job.unit_count} × {(job.unit_mass_kg / 1000).toFixed(1)} t
        </Text>
      )
    },
    job.special_job && {
      icon: 'tabler:alert-triangle',
      label: 'special',
      children: (
        <TagChip color="#f59e0b" icon="tabler:check" label={t('details.yes')} />
      )
    },
    {
      icon: 'tabler:alert-hexagon',
      label: 'cargoDamage',
      children: (
        <Text
          align={{ sm: 'right' }}
          color={job.cargo_damage > 0 ? 'dangerous' : undefined}
        >
          {`${(job.cargo_damage * 100).toFixed(1)}%`}
        </Text>
      )
    }
  ]

  return (
    <Section title="cargo">
      <Flex
        align={{ base: 'stretch', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <CargoPreview desktopSize={contentHeight} fill job={job} />
        <Box ref={contentRef} flex="1" minWidth="0">
          <DetailRow rows={rows} />
        </Box>
      </Flex>
    </Section>
  )
}

export default CargoSection
