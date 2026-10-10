import {
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  ModuleHeader,
  useModalStore
} from '@lifeforge/ui'

import IngestTokenModal from './components/IngestTokenModal'

function Dashboard() {
  const { open } = useModalStore()

  return (
    <>
      <ModuleHeader
        icon="tabler:layout-dashboard"
        title="dashboard"
        trailing={
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:key"
              label="ingestToken"
              onClick={() => open(IngestTokenModal, {})}
            />
          </ContextMenu>
        }
      />
      <EmptyStateScreen
        icon="tabler:layout-dashboard"
        message={{ id: 'dashboard' }}
      />
    </>
  )
}

export default Dashboard
