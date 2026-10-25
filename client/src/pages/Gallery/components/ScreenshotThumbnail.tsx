import type { RenderImageProps } from 'react-photo-album'

import { Image, surface } from '@lifeforge/ui'

function ScreenshotThumbnail({
  alt,
  className,
  src,
  style,
  ...props
}: RenderImageProps) {
  return (
    <Image
      {...props}
      alt={alt ?? ''}
      bg={surface.light}
      className={className}
      fallback="tabler:photo"
      fit="cover"
      height="100%"
      r="md"
      src={src}
      style={{ ...style, isolation: 'isolate' }}
      width="100%"
    />
  )
}

export default ScreenshotThumbnail
