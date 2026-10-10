import { Flex, Icon, Stack, Text } from '@lifeforge/ui'

interface JobStatProps {
  icon: string
  label: string
  value: string
  valueIcon?: string
}

function JobStat({ icon, label, value, valueIcon }: JobStatProps) {
  return (
    <Stack gap="xs" minWidth="0">
      <Flex align="center" gap="xs" minWidth="0">
        <Icon color="muted" icon={icon} size="1.25rem" />
        <Text truncate color="muted" size="sm">
          {label}
        </Text>
      </Flex>
      <Flex align="center" gap="xs" minWidth="0">
        {valueIcon && <Icon icon={valueIcon} size="1.25rem" />}
        <Text truncate weight="medium">
          {value}
        </Text>
      </Flex>
    </Stack>
  )
}

export default JobStat
