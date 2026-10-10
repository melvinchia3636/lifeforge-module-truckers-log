import { useEffect, useRef, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Alert, Button, Card, Flex, Text, surface, toast } from '@lifeforge/ui'

function TokenDisplay({
  revealedToken,
  tokenLast4
}: {
  revealedToken: string | null
  tokenLast4?: string | null
}) {
  const { t } = useModuleTranslation()
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  async function handleCopy() {
    if (!revealedToken) return

    await navigator.clipboard.writeText(revealedToken)

    toast.success(t('modals.ingestToken.copied'))

    setCopied(true)

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }

    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1000)
  }

  return (
    <>
      <Card bg={surface.light}>
        {revealedToken ? (
          <Flex align="center" gap="md" justify="between" width="100%">
            <Text style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {revealedToken}
            </Text>
            <Button
              icon={copied ? 'tabler:check' : 'tabler:copy'}
              variant="plain"
              onClick={handleCopy}
            />
          </Flex>
        ) : (
          <Text color={{ base: 'bg-600', dark: 'bg-400' }}>
            {t('modals.ingestToken.masked', { last4: tokenLast4 })}
          </Text>
        )}
      </Card>
      {revealedToken && (
        <Alert type="warning">{t('modals.ingestToken.revealWarning')}</Alert>
      )}
    </>
  )
}

export default TokenDisplay
