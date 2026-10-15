import type { RenderImageProps } from 'react-photo-album'

import { Box, Icon, surface } from '@lifeforge/ui'

function ScreenshotThumbnail({
  alt,
  className,
  src,
  style,
  ...props
}: RenderImageProps) {
  return (
    <Box
      bg={surface.light}
      className={className}
      overflow="hidden"
      position="relative"
      r="md"
      style={{ ...style, isolation: 'isolate' }}
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
        {...props}
        alt={alt}
        src={src}
        style={{
          display: 'block',
          height: '100%',
          objectFit: 'cover',
          width: '100%'
        }}
      />
    </Box>
  )
}

export default ScreenshotThumbnail
