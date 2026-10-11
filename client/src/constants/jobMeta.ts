import type { ColorValue } from '@lifeforge/ui'

export const STATUS_COLORS: Record<string, string> = {
  active: 'oklch(0.62 0.15 250)',
  delivered: 'oklch(0.65 0.16 150)',
  cancelled: 'oklch(0.6 0.2 25)',
  interrupted: 'oklch(0.6 0.03 260)'
}

export const STATUS_ICONS: Record<string, string> = {
  active: 'tabler:truck-delivery',
  delivered: 'tabler:circle-check',
  cancelled: 'tabler:circle-x',
  interrupted: 'tabler:alert-triangle'
}

export const MARKET_COLORS: Record<string, ColorValue> = {
  quick_job: 'amber-500',
  freight_market: 'blue-500',
  external_contracts: 'purple-500'
}

export const MARKET_ICONS: Record<string, string> = {
  quick_job: 'tabler:bolt',
  freight_market: 'tabler:building-warehouse',
  external_contracts: 'tabler:world'
}

export const GAME_ICONS: Record<string, string> = {
  ets2: 'circle-flags:eu',
  ats: 'circle-flags:us'
}

export const BRAND_ICONS: Record<string, string> = {
  daf: 'simple-icons:daf',
  iveco: 'simple-icons:iveco',
  man: 'simple-icons:man',
  mercedes: 'simple-icons:mercedes',
  'mercedes-benz': 'simple-icons:mercedes',
  renault: 'simple-icons:renault',
  scania: 'simple-icons:scania',
  volvo: 'simple-icons:volvo'
}

export const TRUCK_ICON = 'tabler:truck'

export function brandIcon(brand: string | null): string {
  if (!brand) return TRUCK_ICON

  return BRAND_ICONS[brand.trim().toLowerCase()] ?? TRUCK_ICON
}

export function currencyFor(game: string): string {
  return game === 'ats' ? '$' : '€'
}
