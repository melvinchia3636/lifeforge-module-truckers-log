import type { Map as MapLibreMap } from 'maplibre-gl'
import { useEffect } from 'react'

/**
 * Feed the individual `public/map-icons/*.png` files to MapLibre whenever it
 * reports a missing image (the generated sprite sheet isn't in the repo).
 */
export function IconLoader(props: { map: MapLibreMap | null }) {
  useEffect(() => {
    const map = props.map

    if (!map) return

    const onMissing = async (event: { id: string }) => {
      const id = event.id

      if (!id || map.hasImage(id) || id === 'exit-sign') return

      try {
        const res = await fetch(
          `${import.meta.env.BASE_URL}map-icons/${id}.png`
        )

        if (!res.ok) return

        const bitmap = await createImageBitmap(await res.blob())

        if (!map.hasImage(id)) map.addImage(id, bitmap)
      } catch {
        // ignore missing icons
      }
    }
    map.on('styleimagemissing', onMissing)

    return () => {
      map.off('styleimagemissing', onMissing)
    }
  }, [props.map])

  return null
}
