/** Reads intrinsic pixel dimensions from PNG/JPEG headers, if recognizable. */
export function imageSize(
  buffer: Buffer
): { width: number; height: number } | null {
  if (isPng(buffer)) {
    // IHDR: 8-byte signature, 4-byte length, 4-byte type, then width/height.
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }

  if (isJpeg(buffer)) {
    let offset = 2

    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1
        continue
      }

      const marker = buffer[offset + 1]!

      // Standalone markers carry no length.
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2
        continue
      }

      const length = buffer.readUInt16BE(offset + 2)

      // SOF0-SOF15 (excluding the non-frame markers) hold the dimensions.
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        }
      }

      offset += 2 + length
    }
  }

  return null
}

function isPng(buffer: Buffer): boolean {
  return (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
}

function isJpeg(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8
}
