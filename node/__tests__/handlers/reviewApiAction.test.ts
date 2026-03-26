jest.mock('co-body', () => ({
  json: jest.fn(),
}))

jest.mock('../../services/productReview', () => ({
  verifySchema: jest.fn().mockResolvedValue('ok'),
  getReview: jest.fn(),
  getReviews: jest.fn(),
  getReviewsByProductIdFull: jest.fn(),
  getAverageRatingByProductId: jest.fn(),
  getReviewsByProductId: jest.fn(),
  newReview: jest.fn(),
  deleteReview: jest.fn(),
  editReview: jest.fn(),
  hasShopperReviewed: jest.fn(),
  shopperHasPurchasedProduct: jest.fn(),
}))

jest.mock('../../services/authorization', () => ({
  retrieveAuthenticatedUser: jest.fn(),
  validateLicenseManagerAccess: jest.fn(),
}))

import { reviewApiAction, reviewApiActionId } from '../../handlers/reviewApiAction'
import * as authorizationService from '../../services/authorization'
import * as productReviewService from '../../services/productReview'

describe('reviewApiAction handler', () => {
  const createCtx = (method: string, requestedAction: string, query: any = {}): any => ({
    clients: {
      productReview: {},
      appSettings: {},
      authorization: {},
    },
    vtex: {
      route: {
        params: { requestedAction },
      },
      logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(), log: jest.fn() },
      adminUserAuthToken: 'admin-token',
      storeUserAuthToken: 'store-token',
    },
    headers: {},
    method,
    query,
    req: {},
    status: 0,
    body: null,
    set: jest.fn(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET review', () => {
    it('should return 400 when id is missing', async () => {
      const ctx = createCtx('GET', 'review', {})
      const next = jest.fn()

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)

      await reviewApiAction(ctx, next)

      expect(ctx.status).toBe(400)
      expect(ctx.body).toBe('Missing parameter.')
    })

    it('should return review when id is provided', async () => {
      const ctx = createCtx('GET', 'review', { id: 'review-1' })
      const next = jest.fn()
      const mockReview = { id: 'review-1', productId: '123', rating: 5, shopperId: 'shopper1' }

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)
      ;(productReviewService.getReview as jest.Mock).mockResolvedValueOnce(mockReview)

      await reviewApiAction(ctx, next)

      expect(ctx.status).toBe(200)
      // Non-admin user should have shopperId nulled
      expect(ctx.body.shopperId).toBeNull()
    })

    it('should preserve shopperId for admin user', async () => {
      const ctx = createCtx('GET', 'review', { id: 'review-1' })
      const next = jest.fn()
      const mockReview = { id: 'review-1', productId: '123', rating: 5, shopperId: 'shopper1' }

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce({
        id: 'admin-1', user: 'admin@test.com', authStatus: 'Success',
      })
      ;(authorizationService.validateLicenseManagerAccess as jest.Mock).mockResolvedValueOnce(true)
      ;(productReviewService.getReview as jest.Mock).mockResolvedValueOnce(mockReview)

      await reviewApiAction(ctx, next)

      expect(ctx.status).toBe(200)
      expect(ctx.body.shopperId).toBe('shopper1')
    })
  })

  describe('GET reviews', () => {
    it('should return search response', async () => {
      const ctx = createCtx('GET', 'reviews', { from: '0', to: '3' })
      const next = jest.fn()

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)
      ;(productReviewService.getReviews as jest.Mock).mockResolvedValueOnce({
        reviews: [{ id: '1', productId: '123', shopperId: 'shopper1' }],
        range: { total: 1, from: 0, to: 1 },
      })

      await reviewApiAction(ctx, next)

      expect(ctx.status).toBe(200)
      expect(ctx.body.data.data).toHaveLength(1)
      // Non-admin: shopperId should be nulled
      expect(ctx.body.data.data[0].shopperId).toBeNull()
    })
  })

  describe('GET rating', () => {
    it('should return rating response', async () => {
      const ctx = createCtx('GET', 'rating', { id: '123' })
      const next = jest.fn()

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)
      ;(productReviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValueOnce({
        average: 4.5,
        starsFive: 5,
        starsFour: 3,
        starsThree: 1,
        starsTwo: 0,
        starsOne: 1,
        total: 10,
      })
      ;(productReviewService.getReviewsByProductId as jest.Mock).mockResolvedValueOnce({
        reviews: [],
        range: { total: 10, from: 0, to: 10 },
      })

      // rating uses id from query not route
      ctx.query.id = '123'
      await reviewApiAction(ctx, next)

      expect(ctx.status).toBe(200)
      expect(ctx.body.average).toBe(4.5)
      expect(ctx.body.totalCount).toBe(10)
    })
  })

  describe('POST review', () => {
    it('should return 401 when user is not validated', async () => {
      const ctx = createCtx('POST', 'review')
      const next = jest.fn()
      const { json } = require('co-body')

      json.mockResolvedValueOnce({
        productId: '123',
        rating: 5,
        title: 'Great',
        text: 'Great product',
        reviewerName: 'Test',
        approved: true,
      })

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)

      await reviewApiAction(ctx, next)

      expect(ctx.status).toBe(401)
    })
  })

  describe('DELETE review', () => {
    it('should return Invalid User when not admin', async () => {
      const ctx = createCtx('DELETE', 'review', { id: 'review-1' })
      const next = jest.fn()

      ctx.vtex.route.params.requestedAction = 'review'
      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)

      await reviewApiAction(ctx, next)

      // Non-admin should get "Invalid User" for delete review
      expect(ctx.body).toBe('Invalid User')
    })
  })

  describe('reviewApiActionId', () => {
    it('should pass id from route params', async () => {
      const ctx = createCtx('GET', 'review')

      ctx.vtex.route.params = { requestedAction: 'review', id: 'review-123' }
      const next = jest.fn()
      const mockReview = { id: 'review-123', productId: '123', rating: 5 }

      ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)
      ;(productReviewService.getReview as jest.Mock).mockResolvedValueOnce(mockReview)

      await reviewApiActionId(ctx, next)

      expect(ctx.status).toBe(200)
      expect(productReviewService.getReview).toHaveBeenCalledWith(
        expect.anything(),
        'review-123'
      )
    })
  })
})
