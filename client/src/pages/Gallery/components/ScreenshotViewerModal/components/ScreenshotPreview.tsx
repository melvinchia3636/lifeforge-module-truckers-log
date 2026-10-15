import { Box, Icon, surface } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { Screenshot } from '@/pages/Gallery'

function ScreenshotPreview({ screenshot }: { screenshot: Screenshot }) {
  return (
    <Box
      bg={surface.light}
      maxHeight="65vh"
      minHeight="20rem"
      overflow="hidden"
      position="relative"
      r="lg"
      style={{ isolation: 'isolate' }}
    >
      <Box
        asChild
        left="50%"
        position="absolute"
        style={{ transform: 'translate(-50%, -50%)' }}
        top="50%"
        zIndex="-1"
      >
        <Icon
          color={{ base: 'bg-200', dark: 'bg-700' }}
          icon="tabler:photo"
          size="3em"
        />
      </Box>
      <img
        alt=""
        src={forgeAPI.getMedia({ key: screenshot.file_key, thumb: '1600x0' })}
        style={{
          display: 'block',
          maxHeight: '65vh',
          objectFit: 'contain',
          width: '100%'
        }}
      />
    </Box>
  )
}

export default ScreenshotPreview
