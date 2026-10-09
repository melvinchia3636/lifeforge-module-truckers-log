import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/** Generates a new random, URL-safe ingest token. */
export function generateToken(): string {
  return randomBytes(32).toString('base64url')
}

/** Hashes an ingest token for at-rest storage. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** Constant-time comparison of a candidate token against a stored hash. */
export function tokenMatches(token: string, storedHash: string): boolean {
  if (!storedHash) return false

  const incoming = Buffer.from(hashToken(token), 'hex')

  const stored = Buffer.from(storedHash, 'hex')

  if (incoming.length !== stored.length) return false

  return timingSafeEqual(incoming, stored)
}
