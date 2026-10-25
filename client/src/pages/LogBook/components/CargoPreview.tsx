import { Image, surface } from '@lifeforge/ui'

import { resolveCargoPreview } from '@/lib/cargoPreview'
import type { Job } from '@/pages/LogBook'

function CargoPreview({
  job,
  size,
  fill = false,
  desktopSize = 0,
  squareSize = 0
}: {
  job: Job
  size?: string
  fill?: boolean
  desktopSize?: number
  squareSize?: number
}) {
  const src = resolveCargoPreview(
    job.cargo_id,
    job.comp_src_id,
    job.comp_dst_id,
    job.trailer_body_type
  )

  const dimension = squareSize > 0 ? `${squareSize}px` : size

  const hasDesktopSize = desktopSize > 0

  const display = fill
    ? hasDesktopSize
      ? ('block' as const)
      : ({ base: 'block', sm: 'none' } as const)
    : undefined

  const height = fill
    ? hasDesktopSize
      ? { sm: `${desktopSize}px` }
      : undefined
    : squareSize > 0
      ? dimension
      : undefined

  const width = fill
    ? hasDesktopSize
      ? { base: 'calc(100% - 1rem)', sm: `${desktopSize}px` }
      : 'calc(100% - 1rem)'
    : dimension

  return (
    <Image
      alt=""
      aspectRatio={fill ? undefined : '1'}
      bg={surface.light}
      display={display}
      fallback={null}
      fit="contain"
      flexShrink="0"
      height={height}
      m={fill ? 'sm' : undefined}
      overflow="hidden"
      p="xs"
      r="md"
      src={src}
      width={width}
    />
  )
}

export default CargoPreview
