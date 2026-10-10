import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Card, Flex, Stack, Text, surface } from '@lifeforge/ui'

function Section({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  const { t } = useModuleTranslation()

  return (
    <Stack gap="sm">
      <Flex align="center" gap="sm" pl="md" position="relative">
        <Box
          bg="custom-500"
          bottom="0"
          left="0"
          position="absolute"
          r="full"
          top="0"
          width="0.25rem"
        />
        <Text as="h2" size="lg" weight="semibold">
          {t(`details.sections.${title}`)}
        </Text>
      </Flex>
      <Card
        bg={surface.light}
        gap="none"
        overflow="hidden"
        p="none"
        width="100%"
      >
        {children}
      </Card>
    </Stack>
  )
}

export default Section
