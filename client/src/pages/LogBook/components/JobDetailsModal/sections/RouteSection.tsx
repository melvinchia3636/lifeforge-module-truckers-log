import { Button, Text } from '@lifeforge/ui'
import { useLocation, useNavigate } from 'react-router'

import CityLabel from '@/pages/LogBook/components/JobItem/components/CityLabel'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import {
  useCloseJobDetailsModal,
  useJobDetails
} from '../contexts/JobDetailsContext'

function RouteSection() {
  const job = useJobDetails()
  const closeModal = useCloseJobDetailsModal()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function showInMap() {
    const base = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`

    closeModal()
    navigate(`${base}/map?id=${job.id}`)
  }

  const rows = [
    {
      icon: 'tabler:map-pin',
      label: 'origin',
      children: (
        <CityLabel stacked cityId={job.city_src_id} name={job.city_src} />
      )
    },
    {
      icon: 'tabler:flag',
      label: 'destination',
      children: (
        <CityLabel stacked cityId={job.city_dst_id} name={job.city_dst} />
      )
    },
    {
      icon: 'tabler:building-factory-2',
      label: 'sender',
      children: <Text>{job.comp_src || '—'}</Text>
    },
    {
      icon: 'tabler:building-warehouse',
      label: 'receiver',
      children: <Text>{job.comp_dst || '—'}</Text>
    }
  ]

  return (
    <>
      <Section title="route">
        <DetailRow rows={rows} />
      </Section>
      <Button
        icon="tabler:map"
        variant="secondary"
        width="100%"
        onClick={showInMap}
      >
        showInMap
      </Button>
    </>
  )
}

export default RouteSection
