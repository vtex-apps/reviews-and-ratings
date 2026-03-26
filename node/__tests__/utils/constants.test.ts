import {
  DATA_ENTITY,
  SCHEMA,
  SCHEMA_JSON,
  REVIEWS_BUCKET,
  LOOKUP,
  HASHED_SCHEMA,
  SUCCESSFUL_MIGRATION,
  APP_SETTINGS,
  MAXIMUM_RETURNED_RECORDS,
  DELIMITER,
  ENVIRONMENT,
  REVIEW,
  REVIEWS,
  RATING,
  AUTH_SUCCESS,
} from '../../utils/constants'

describe('constants', () => {
  it('should export DATA_ENTITY', () => {
    expect(DATA_ENTITY).toBe('productReviews')
  })

  it('should export SCHEMA', () => {
    expect(SCHEMA).toBe('reviewsSchema')
  })

  it('should export SCHEMA_JSON as a valid JSON string', () => {
    expect(() => JSON.parse(SCHEMA_JSON)).not.toThrow()
    const parsed = JSON.parse(SCHEMA_JSON)

    expect(parsed.name).toBe('reviewsSchema')
    expect(parsed.properties).toBeDefined()
    expect(parsed['v-indexed']).toBeDefined()
  })

  it('should export REVIEWS_BUCKET', () => {
    expect(REVIEWS_BUCKET).toBe('productReviews')
  })

  it('should export LOOKUP', () => {
    expect(LOOKUP).toBe('productLookup')
  })

  it('should export HASHED_SCHEMA', () => {
    expect(HASHED_SCHEMA).toBe('HashedSchema')
  })

  it('should export SUCCESSFUL_MIGRATION', () => {
    expect(SUCCESSFUL_MIGRATION).toBe('SuccessfulMigration')
  })

  it('should export APP_SETTINGS', () => {
    expect(APP_SETTINGS).toBe('vtex.reviews-and-ratings')
  })

  it('should export MAXIMUM_RETURNED_RECORDS as 500', () => {
    expect(MAXIMUM_RETURNED_RECORDS).toBe(500)
  })

  it('should export DELIMITER', () => {
    expect(DELIMITER).toBe(':')
  })

  it('should export ENVIRONMENT', () => {
    expect(ENVIRONMENT).toBe('vtexcommercestable')
  })

  it('should export REST action names', () => {
    expect(REVIEW).toBe('review')
    expect(REVIEWS).toBe('reviews')
    expect(RATING).toBe('rating')
  })

  it('should export AUTH_SUCCESS', () => {
    expect(AUTH_SUCCESS).toBe('Success')
  })
})
