import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Card,
  Flex,
  ModalHeader,
  Stack,
  Text,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const NAMESPACE = 'apps.melvinchia3636--ets2-record'

function IngestTokenModal({ onClose }: { onClose: () => void }) {
  const { t } = useModuleTranslation()
  const [revealedToken, setRevealedToken] = useState<string | null>(null)
  const settingsQuery = useQuery(forgeAPI.settings.get.queryOptions())

  const rotateMutation = useForgeMutation(forgeAPI.settings.rotate, {
    action: 'update',
    queryKey: forgeAPI.settings.key
  })

  const settings = settingsQuery.data

  const hasToken = Boolean(settings?.tokenLast4)

  async function handleRotate() {
    const result = await rotateMutation.mutateAsync(undefined)

    setRevealedToken(result.token)
  }

  async function handleCopy() {
    if (!revealedToken) return

    await navigator.clipboard.writeText(revealedToken)

    toast.success(t('modals.ingestToken.copied'))
  }

  return (
    <Flex direction="column" minWidth="40vw">
      <ModalHeader
        icon="tabler:key"
        namespace={NAMESPACE}
        title="ingestToken"
        onClose={onClose}
      />
      <Stack gap="md">
        <Text as="p" color="muted">
          {t('modals.ingestToken.description')}
        </Text>
        <Card p="md">
          {revealedToken ? (
            <Flex align="center" gap="md" justify="between" width="100%">
              <Text
                color="primary"
                style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
              >
                {revealedToken}
              </Text>
              <Button
                icon="tabler:copy"
                variant="plain"
                onClick={handleCopy}
              />
            </Flex>
          ) : (
            <Text color="muted">
              {hasToken
                ? t('modals.ingestToken.masked', {
                    last4: settings?.tokenLast4
                  })
                : t('modals.ingestToken.noToken')}
            </Text>
          )}
        </Card>
        {revealedToken && (
          <Text color="muted" size="sm">
            {t('modals.ingestToken.revealWarning')}
          </Text>
        )}
        <Flex justify="end">
          <Button
            icon="tabler:refresh"
            loading={rotateMutation.isPending}
            namespace={false}
            onClick={handleRotate}
          >
            {t(hasToken ? 'buttons.rotateToken' : 'buttons.generateToken')}
          </Button>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default IngestTokenModal
