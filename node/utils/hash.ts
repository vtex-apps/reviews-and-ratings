import crypto from 'crypto'

/**
 * Compute SHA-256 hash of a string, returned as hex.
 * Converted from C# ProductReviewRepository.GetSHA256()
 */
export function getSHA256(str: string): string {
  return crypto.createHash('sha256').update(str, 'ascii').digest('hex')
}
