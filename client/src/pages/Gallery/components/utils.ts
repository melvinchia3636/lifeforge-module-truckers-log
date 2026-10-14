import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type Screenshot = InferOutput<typeof forgeAPI.screenshots.get>

/** Resolves a stored screenshot to a servable URL (optionally a thumbnail). */
export function screenshotUrl(
  screenshot: Pick<Screenshot, 'file_key'>,
  thumb?: string
): string | undefined {
  if (!screenshot.file_key) return undefined

  return forgeAPI.getMedia({ key: screenshot.file_key, thumb })
}

export const SCREENSHOT_THUMB = '400x0'

export const SCREENSHOT_PREVIEW = '1600x0'
