import { useState } from 'react'

import { Box, Icon, surface } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { Screenshot } from '@/pages/Gallery'

function ScreenshotPreview({ screenshot }: { screenshot: Screenshot }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Box
      bg={surface.light}
      maxHeight="65vh"
      maxWidth="100%"
      minHeight={loaded ? undefined : '20rem'}
      overflow="hidden"
      position="relative"
      r="lg"
      style={{ alignSelf: 'center', isolation: 'isolate' }}
      width={loaded ? 'fit-content' : '100%'}
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
          color={{ base: 'bg-300', dark: 'bg-700' }}
          icon="tabler:photo"
          size="5em"
        />
      </Box>
      <img
        alt=""
        src={forgeAPI.getMedia({ key: screenshot.file_key, thumb: '1600x0' })}
        style={{
          display: 'block',
          height: 'auto',
          maxHeight: '65vh',
          maxWidth: '100%',
          objectFit: 'contain',
          width: 'auto'
        }}
        onLoad={() => setLoaded(true)}
      />
    </Box>
  )
}

export default ScreenshotPreview
