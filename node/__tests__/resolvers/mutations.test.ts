jest.mock('../../services/productReview', () => ({
  isAdminAuthUser: jest.fn(),
  isValidAuthUser: jest.fn(),
  getAppSettings: jest.fn(),
  newReview: jest.fn(),
  editReview: jest.fn(),
  deleteReview: jest.fn(),
  moderateReview: jest.fn(),
}))

import { mutations } from '../../resolvers/mutations'
import * as productReviewService from '../../services/productReview'

const createCtx = (): any => ({
  clients: {
    productReview: {},
    appSettings: {},
  },
  vtex: {
    adminUserAuthToken: 'admin-token',
    storeUserAuthToken: 'store-token',
    account: 'testaccount',
    logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(), log: jest.fn() },
  },
  headers: {},
})

describe('GraphQL mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('newReview', () => {
    it('should create review when anonymous reviews allowed', async () => {
      const ctx = createCtx()

      ;(productReviewService.getAppSettings as jest.Mock).mockResolvedValueOnce({
        allowAnonymousReviews: true,
      })
      ;(productReviewService.newReview as jest.Mock).mockResolvedValueOnce({
        id: 'new-review-1',
        productId: '123',
        rating: 5,
      })

      const result = await mutations.newReview(
        null,
        { review: { productId: '123', rating: 5 } },
        ctx
      )

      expect(result).toBeDefined()
      expect(result?.id).toBe('new-review-1')
      // Should not have checked auth
      expect(productReviewService.isValidAuthUser).not.toHaveBeenCalled()
    })

    it('should check auth when anonymous reviews not allowed', async () => {
      const ctx = createCtx()

      ;(productReviewService.getAppSettings as jest.Mock).mockResolvedValueOnce({
        allowAnonymousReviews: false,
      })
      ;(productReviewService.isValidAuthUser as jest.Mock).mockResolvedValueOnce(200)
      ;(productReviewService.newReview as jest.Mock).mockResolvedValueOnce({
        id: 'new-review-1',
        productId: '123',
        rating: 5,
      })

      const result = await mutations.newReview(
        null,
        { review: { productId: '123', rating: 5 } },
        ctx
      )

      expect(result).toBeDefined()
      expect(productReviewService.isValidAuthUser).toHaveBeenCalled()
    })

    it('should throw when auth fails', async () => {
      const ctx = createCtx()

      ;(productReviewService.getAppSettings as jest.Mock).mockResolvedValueOnce({
        allowAnonymousReviews: false,
      })
      ;(productReviewService.isValidAuthUser as jest.Mock).mockResolvedValueOnce(401)

      await expect(
        mutations.newReview(null, { review: { productId: '123', rating: 5 } }, ctx)
      ).rejects.toThrow()
    })
  })

  describe('editReview', () => {
    it('should edit review when admin', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(200)
      ;(productReviewService.editReview as jest.Mock).mockResolvedValueOnce({
        id: 'review-1',
        productId: '123',
        rating: 4,
      })

      const result = await mutations.editReview(
        null,
        { id: 'review-1', review: { productId: '123', rating: 4 } },
        ctx
      )

      expect(result).toBeDefined()
      expect(result?.rating).toBe(4)
    })

    it('should throw when not admin', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(403)

      await expect(
        mutations.editReview(
          null,
          { id: 'review-1', review: { productId: '123' } },
          ctx
        )
      ).rejects.toThrow()
    })
  })

  describe('deleteReview', () => {
    it('should delete reviews when admin', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(200)
      ;(productReviewService.deleteReview as jest.Mock).mockResolvedValueOnce(true)

      const result = await mutations.deleteReview(
        null,
        { ids: ['review-1', 'review-2'] },
        ctx
      )

      expect(result).toBe(true)
    })
  })

  describe('moderateReview', () => {
    it('should moderate reviews when admin', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(200)
      ;(productReviewService.moderateReview as jest.Mock).mockResolvedValueOnce(true)

      const result = await mutations.moderateReview(
        null,
        { ids: ['review-1'], approved: true },
        ctx
      )

      expect(result).toBe(true)
    })

    it('should throw when not admin', async () => {
      const ctx = createCtx()

      ;(productReviewService.isAdminAuthUser as jest.Mock).mockResolvedValueOnce(401)

      await expect(
        mutations.moderateReview(
          null,
          { ids: ['review-1'], approved: true },
          ctx
        )
      ).rejects.toThrow()
    })
  })
})
