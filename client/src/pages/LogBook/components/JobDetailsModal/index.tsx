import { ModalHeader, Stack, WithQueryData } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import Header from './components/Header'
import { JobDetailsProvider } from './contexts/JobDetailsContext'
import CargoSection from './sections/CargoSection'
import DrivingSection from './sections/DrivingSection'
import EconomySection from './sections/EconomySection'
import EventsSection from './sections/EventsSection'
import JourneySection from './sections/JourneySection'
import OverviewSection from './sections/OverviewSection'
import RouteSection from './sections/RouteSection'
import VehicleSection from './sections/VehicleSection'

const NAMESPACE = 'apps.melvinchia3636--truckers-log'

function JobDetailsModal({
  data: { id },
  onClose
}: {
  data: { id: string }
  onClose: () => void
}) {
  return (
    <Stack gap="xl" minWidth="40vw">
      <ModalHeader
        icon="tabler:info-circle"
        namespace={NAMESPACE}
        title="jobDetails"
        onClose={onClose}
      />
      <WithQueryData contract={forgeAPI.jobs.get.input({ id })}>
        {job => (
          <JobDetailsProvider job={job} onClose={onClose}>
            <Header />
            <Stack gap="lg">
              <RouteSection />
              <OverviewSection />
              <CargoSection />
              <EconomySection />
              <JourneySection />
              <EventsSection />
              <VehicleSection />
              <DrivingSection />
            </Stack>
          </JobDetailsProvider>
        )}
      </WithQueryData>
    </Stack>
  )
}

export default JobDetailsModal
