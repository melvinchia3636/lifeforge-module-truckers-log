import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  ModuleHeader,
  useModalStore
} from '@lifeforge/ui'

import IngestTokenModal from './components/modals/IngestTokenModal'

function Ets2Record() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  return (
    <>
      <ModuleHeader
        trailing={
          <Button
            icon="tabler:key"
            namespace={false}
            variant="plain"
            onClick={() => open(IngestTokenModal, {})}
          >
            {t('buttons.ingestToken')}
          </Button>
        }
      />
      <EmptyStateScreen icon="tabler:truck-off" message={{ id: 'records' }} />
    </>
  )
}

export default Ets2Record
