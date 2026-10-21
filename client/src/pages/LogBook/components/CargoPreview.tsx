import { Box, surface } from '@lifeforge/ui'

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
    job.comp_dst_id
  )

  if (fill) {
    return (
      <>
        <Box
          bg={surface.light}
          display={{ base: 'block', sm: 'none' }}
          m="sm"
          overflow="hidden"
          p="xs"
          r="md"
          width="calc(100% - 1rem)"
        >
          <img
            alt=""
            src={src}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </Box>
        {desktopSize > 0 && (
          <Box
            bg={surface.light}
            display={{ base: 'none', sm: 'block' }}
            flexShrink="0"
            height={`${desktopSize}px`}
            m="sm"
            overflow="hidden"
            p="xs"
            r="md"
            width={`${desktopSize}px`}
          >
            <img
              alt=""
              src={src}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </>
    )
  }

  const dimension = squareSize > 0 ? `${squareSize}px` : size

  return (
    <Box
      aspectRatio="1"
      bg={surface.light}
      flexShrink="0"
      height={squareSize > 0 ? dimension : undefined}
      overflow="hidden"
      p="xs"
      r="md"
      width={dimension}
    >
      <img
        alt=""
        src={src}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </Box>
  )
}

export default CargoPreview
