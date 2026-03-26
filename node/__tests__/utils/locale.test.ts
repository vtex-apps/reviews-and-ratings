import { localeList } from '../../utils/locale'

describe('localeList', () => {
  it('should be a non-empty object', () => {
    expect(typeof localeList).toBe('object')
    expect(Object.keys(localeList).length).toBeGreaterThan(0)
  })

  it('should have the "en" locale with many countries', () => {
    expect(localeList.en).toBeDefined()
    expect(Array.isArray(localeList.en)).toBe(true)
    expect(localeList.en).toContain('US')
    expect(localeList.en).toContain('GB')
    expect(localeList.en.length).toBeGreaterThan(10)
  })

  it('should have the "pt" locale with Brazil', () => {
    expect(localeList.pt).toBeDefined()
    expect(localeList.pt).toContain('BR')
  })

  it('should have the "es" locale with Mexico and Spain', () => {
    expect(localeList.es).toBeDefined()
    expect(localeList.es).toContain('MX')
    expect(localeList.es).toContain('ES')
  })

  it('should have "zh-hans" locale', () => {
    expect(localeList['zh-hans']).toBeDefined()
    expect(localeList['zh-hans']).toContain('CN')
  })

  it('should have "zh-hant" locale', () => {
    expect(localeList['zh-hant']).toBeDefined()
    expect(localeList['zh-hant']).toContain('TW')
  })

  it('should return undefined for unknown locale', () => {
    expect(localeList['xx']).toBeUndefined()
  })

  it('should have all values as arrays of strings', () => {
    for (const [key, value] of Object.entries(localeList)) {
      expect(Array.isArray(value)).toBe(true)
      for (const country of value) {
        expect(typeof country).toBe('string')
        // Country codes should be 2 characters
        expect(country.length).toBe(2)
      }
    }
  })
})
