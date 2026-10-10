import { useMemo } from 'react'

import { Flex, Icon, Stack, Text, usePersonalization } from '@lifeforge/ui'

import { CITY_COUNTRY } from '@/constants/cityCountry'

interface CityLabelProps {
  cityId: string
  name: string
  muted?: boolean
  stacked?: boolean
}

function regionName(iso: string, language: string): string {
  const code = iso.toUpperCase()

  const display = () => new Intl.DisplayNames([language], { type: 'region' })

  try {
    return display().of(code) ?? code
  } catch {
    const parent = code.split('-')[0] ?? code

    try {
      return display().of(parent) ?? parent
    } catch {
      return code
    }
  }
}

function CityLabel({
  cityId,
  name,
  muted = true,
  stacked = false
}: CityLabelProps) {
  const { language } = usePersonalization()

  const iso = CITY_COUNTRY[cityId]

  const country = useMemo(
    () => (iso ? regionName(iso, language) : null),
    [iso, language]
  )

  if (stacked) {
    return (
      <Stack align={{ base: 'start', sm: 'end' }} gap="none">
        {iso && (
          <Flex align="center" gap="xs">
            <Icon icon={`circle-flags:${iso}`} size="1rem" />
            <Text color="muted" size="sm">
              {country}
            </Text>
          </Flex>
        )}
        <Text>{name}</Text>
      </Stack>
    )
  }

  return (
    <Flex align="center" gap="xs" minWidth="0">
      {iso && <Icon icon={`circle-flags:${iso}`} size="1rem" />}
      <Text
        truncate
        color={muted ? 'muted' : undefined}
        size={muted ? 'sm' : undefined}
      >
        {name}
      </Text>
    </Flex>
  )
}

export default CityLabel
