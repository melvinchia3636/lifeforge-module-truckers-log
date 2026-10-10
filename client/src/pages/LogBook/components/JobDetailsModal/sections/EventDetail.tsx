import { Flex, Icon, Text } from '@lifeforge/ui'

function EventDetail({ detail }: { detail: string }) {
  const [from, to] = detail.split('->').map(part => part.trim())

  if (!from || !to) {
    return <Text align={{ sm: 'right' }}>{detail}</Text>
  }

  return (
    <Flex align="center" gap="xs">
      <Text align={{ sm: 'right' }}>{from}</Text>
      <Icon color="muted" icon="tabler:arrow-right" />
      <Text align={{ sm: 'right' }}>{to}</Text>
    </Flex>
  )
}

export default EventDetail
