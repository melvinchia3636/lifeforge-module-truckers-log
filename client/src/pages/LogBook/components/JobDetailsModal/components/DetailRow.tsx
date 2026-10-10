import type { ReactNode } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Flex,
  Icon,
  Text,
  WithDivide,
  colorWithOpacity
} from '@lifeforge/ui'

interface DetailRowItem {
  icon: string
  label: string
  children: ReactNode
}

function DetailRow({
  rows
}: {
  rows: (DetailRowItem | false | null | undefined)[]
}) {
  const { t } = useModuleTranslation()

  return (
    <>
      {rows
        .filter((row): row is DetailRowItem => Boolean(row))
        .map(({ icon, label, children }, index) => (
          <WithDivide
            key={index}
            color={{
              base: 'bg-200',
              dark: colorWithOpacity('bg-700', '30%')
            }}
          >
            <Flex
              align={{ base: 'start', sm: 'center' }}
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: 'xs', sm: 'xl' }}
              justify="between"
              minWidth="0"
              p="md"
              width="100%"
            >
              <Flex align="center" flexShrink="0" gap="sm" minWidth="0">
                <Icon color="muted" icon={icon} />
                <Text as="h3" color="muted" weight="medium">
                  {t(`details.${label}`)}
                </Text>
              </Flex>
              <Flex
                align={{ base: 'start', sm: 'center' }}
                flex="1"
                justify={{ sm: 'end' }}
                minWidth="0"
              >
                {children}
              </Flex>
            </Flex>
          </WithDivide>
        ))}
    </>
  )
}

export default DetailRow
