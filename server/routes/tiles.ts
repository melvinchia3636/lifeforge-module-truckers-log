import z from 'zod'

import forge from '../forge'

const TILE_HOST = 'https://maps.truckermudgeon.com'

const ALLOWED_FILE = /^[a-z0-9-]+\.pmtiles$/i

/**
 * Reverse proxy for the hosted TruckSim Maps PMTiles, which are CORS-locked to
 * `*.github.io`. Forwards the request's `Range` header and streams the upstream
 * response back, so MapLibre's `pmtiles://` protocol can read tiles same-origin.
 */
export const get = forge
  .query({
    description: 'Proxy TruckSim Maps PMTiles (supports range requests).',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {
      query: z.object({
        file: z.string()
      })
    },
    output: 'custom'
  })
  .callback(async ({ req, query: { file }, res }) => {
    const name = file.replace(/^\/+/, '')

    if (!ALLOWED_FILE.test(name)) {
      return res.status(400).json({ error: 'Invalid tile file' })
    }

    const range = req.headers.range

    const upstream = await fetch(`${TILE_HOST}/${name}`, {
      headers: range ? { Range: range } : undefined
    })

    res.status(upstream.status)

    for (const header of [
      'content-type',
      'content-length',
      'content-range',
      'etag',
      'last-modified'
    ]) {
      const value = upstream.headers.get(header)

      if (value) res.setHeader(header, value)
    }

    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'public, max-age=86400')

    return res.send(Buffer.from(await upstream.arrayBuffer()))
  })
