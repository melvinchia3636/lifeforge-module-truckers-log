import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Alert,
  EmptyStateScreen,
  Flex,
  ModalHeader,
  Stack,
  WithQueryData
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import RotateTokenButton from './components/RotateTokenButton'
import TokenDisplay from './components/TokenDisplay'

function IngestTokenModal({ onClose }: { onClose: () => void }) {
  const { t } = useModuleTranslation()
  const [revealedToken, setRevealedToken] = useState<string | null>(null)

  return (
    <Flex direction="column" minWidth="40vw">
      <ModalHeader icon="tabler:key" title="ingestToken" onClose={onClose} />
      <Stack gap="md">
        <Alert type="note">{t('modals.ingestToken.description')}</Alert>
        <WithQueryData contract={forgeAPI.settings.get}>
          {settings => {
            const hasToken = Boolean(settings.tokenLast4)

            return (
              <>
                {hasToken || revealedToken ? (
                  <TokenDisplay
                    revealedToken={revealedToken}
                    tokenLast4={settings.tokenLast4}
                  />
                ) : (
                  <EmptyStateScreen
                    smaller
                    icon="tabler:key-off"
                    message={{ id: 'token' }}
                    my="md"
                  />
                )}
                <RotateTokenButton
                  hasToken={hasToken}
                  onGenerated={setRevealedToken}
                />
              </>
            )
          }}
        </WithQueryData>
      </Stack>
    </Flex>
  )
}

export default IngestTokenModal
