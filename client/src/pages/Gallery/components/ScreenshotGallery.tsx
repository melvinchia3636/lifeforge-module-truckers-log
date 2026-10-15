import { MasonryPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/masonry.css'

import { Box, Scrollbar, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { Screenshot } from '..'
import ScreenshotThumbnail from './ScreenshotThumbnail'
import ScreenshotViewerModal from './ScreenshotViewerModal'

const PHOTO_SPACING = 12
const PHOTO_MIN_WIDTH = 240

function ScreenshotGallery({ screenshots }: { screenshots: Screenshot[] }) {
  const { open } = useModalStore()

  return (
    <Scrollbar>
      <Box pb="md">
        <MasonryPhotoAlbum
          columns={containerWidth =>
            Math.max(
              1,
              Math.floor(
                (containerWidth + PHOTO_SPACING) /
                  (PHOTO_MIN_WIDTH + PHOTO_SPACING)
              )
            )
          }
          photos={screenshots.map(screenshot => ({
            src: forgeAPI.getMedia({
              key: screenshot.file_key,
              thumb: '400x0'
            }),
            width: screenshot.width ?? 16,
            height: screenshot.height ?? 9,
            key: screenshot.id,
            screenshot
          }))}
          render={{
            image: props => <ScreenshotThumbnail {...props} />
          }}
          spacing={PHOTO_SPACING}
          onClick={({ photo }) =>
            open(ScreenshotViewerModal, {
              screenshot: photo.screenshot
            })
          }
        />
      </Box>
    </Scrollbar>
  )
}

export default ScreenshotGallery
