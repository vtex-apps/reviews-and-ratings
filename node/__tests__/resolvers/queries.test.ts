jest.mock('../../services/productReview', () => ({
  isAdminAuthUser: jest.fn(),
  getReview: jest.fn(),
  getReviews: jest.fn(),
  getReviewsByProductIdFull: jest.fn(),
  getAverageRatingByProductId: jest.fn(),
  getReviewsByProductId: jest.fn(),
  getAppSettings: jest.fn(),
  getReviewsByShopperId: jest.fn(),
  getReviewsByreviewDateTime: jest.fn(),
  getReviewsByDateRange: jest.fn(),
  hasShopperReviewed: jest.fn(),
  verifySchema: jest.fn(),
  migrateData: jest.fn(),
  verifyMigration: jest.fn(),
  successfulMigration: jest.fn(),
}))

import { queries } from '../../resolvers/queries'
import * as productReviewService from '../../services/productReview'

const createCtx = (adminStatus = 200): any => ({
  clients: {
    productReview: {},
    appSettings: {},
  },
  vtex: {
    adminUserAuthToken: 'admin-token',
    account: 'testaccount',
    logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(), log: jest.fn() },
  },
})

describe('GraphQL queries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('review', () => {
    it('should return review when admin', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(200)
      ;(productReviewService.getReview as jest.Mock).mockResolvedValueOnce({
        id: 'review-1',
        productId: '123',
        rating: 5,
      })

      const result = await queries.review(null, { id: 'review-1' }, ctx)

      expect(result).toBeDefined()
      expect(result?.id).toBe('review-1')
    })

    it('should throw AuthenticationError when unauthorized', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(401)

      await expect(queries.review(null, { id: 'review-1' }, ctx)).rejects.toThrow()
    })

    it('should throw ForbiddenError when forbidden', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(403)

      await expect(queries.review(null, { id: 'review-1' }, ctx)).rejects.toThrow()
    })
  })

  describe('averageRatingByProductId', () => {
    it('should return average rating', async () => {
      const ctx = createCtx()
      const mockAvg = {
        average: 4.5,
        starsFive: 5,
        starsFour: 3,
        starsThree: 1,
        starsTwo: 0,
        starsOne: 1,
        total: 10,
      }

      ;(productReviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValueOnce(mockAvg)

      const result = await queries.averageRatingByProductId(null, { productId: '123' }, ctx)

      expect(result).toEqual(mockAvg)
    })
  })

  describe('totalReviewsByProductId', () => {
    it('should return total count', async () => {
      const ctx = createCtx()

      ;(productReviewService.getReviewsByProductId as jest.Mock).mockResolvedValueOnce({
        reviews: [
          { id: '1', approved: true },
          { id: '2', approved: false },
        ],
        range: { total: 2, from: 0, to: 2 },
      })
      ;(productReviewService.getAppSettings as jest.Mock).mockResolvedValueOnce({
        requireApproval: false,
      })

      const result = await queries.totalReviewsByProductId(null, { productId: '123' }, ctx)

      expect(result).toBe(2)
    })

    it('should filter by approval when required', async () => {
      const ctx = createCtx()

      ;(productReviewService.getReviewsByProductId as jest.Mock).mockResolvedValueOnce({
        reviews: [
          { id: '1', approved: true },
          { id: '2', approved: false },
        ],
        range: { total: 2, from: 0, to: 2 },
      })
      ;(productReviewService.getAppSettings as jest.Mock).mockResolvedValueOnce({
        requireApproval: true,
      })

      const result = await queries.totalReviewsByProductId(null, { productId: '123' }, ctx)

      expect(result).toBe(1)
    })
  })

  describe('appSettings', () => {
    it('should return app settings', async () => {
      const ctx = createCtx()
      const mockSettings = { allowAnonymousReviews: true, requireApproval: false }

      ;(productReviewService.getAppSettings as jest.Mock).mockResolvedValueOnce(mockSettings)

      const result = await queries.appSettings(null, null, ctx)

      expect(result).toEqual(mockSettings)
    })
  })

  describe('verifySchema', () => {
    it('should return schema verification result', async () => {
      const ctx = createCtx()

      ;(productReviewService.verifySchema as jest.Mock).mockResolvedValueOnce('Schema is up to date!')

      const result = await queries.verifySchema(null, null, ctx)

      expect(result).toBe('Schema is up to date!')
    })
  })

  describe('reviewsByProductId', () => {
    it('should null out shopperId for non-admin users', async () => {
      const ctx = createCtx()

      ;(productReviewService.getReviewsByProductIdFull as jest.Mock).mockResolvedValueOnce({
        reviews: [{ id: '1', shopperId: 'shopper1' }],
        range: { total: 1, from: 0, to: 1 },
      })
      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(403)

      const result = await queries.reviewsByProductId(
        null,
        { productId: '123' },
        ctx
      )

      expect(result.data.data[0].shopperId).toBeNull()
    })
  })
})
