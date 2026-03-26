import { getSHA256 } from '../../utils/hash'

describe('getSHA256', () => {
  it('should return a hex string', () => {
    const result = getSHA256('hello')

    expect(typeof result).toBe('string')
    expect(result).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should return consistent hash for same input', () => {
    const hash1 = getSHA256('test')
    const hash2 = getSHA256('test')

    expect(hash1).toBe(hash2)
  })

  it('should return different hashes for different inputs', () => {
    const hash1 = getSHA256('hello')
    const hash2 = getSHA256('world')

    expect(hash1).not.toBe(hash2)
  })

  it('should handle empty string', () => {
    const result = getSHA256('')

    expect(result).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should produce correct hash for known value', () => {
    // SHA-256 of "hello" in ASCII
    const expected = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'

    expect(getSHA256('hello')).toBe(expected)
  })
})
