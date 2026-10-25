import { useState } from 'react'

import { ZoomableImage, surface } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { Screenshot } from '@/pages/Gallery'

function ScreenshotPreview({ screenshot }: { screenshot: Screenshot }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <ZoomableImage
      alt=""
      bg={surface.light}
      fallback="tabler:photo"
      fit="contain"
      maxHeight="65vh"
      maxWidth="100%"
      minHeight={loaded ? undefined : '20rem'}
      overflow="hidden"
      r="lg"
      src={forgeAPI.getMedia({ key: screenshot.file_key, thumb: '1600x0' })}
      style={{ alignSelf: 'center', isolation: 'isolate' }}
      width={loaded ? 'fit-content' : '100%'}
      onLoad={() => setLoaded(true)}
    />
  )
}

export default ScreenshotPreview
