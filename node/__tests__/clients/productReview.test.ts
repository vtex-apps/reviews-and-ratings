import { ProductReviewClient } from '../../clients/productReview'

const mockGet = jest.fn()
const mockGetRaw = jest.fn()
const mockPutRaw = jest.fn()
const mockDelete = jest.fn()
const mockPostRaw = jest.fn()

jest.mock('@vtex/api', () => ({
  JanusClient: class {
    context: any
    http: any
    constructor(ctx: any, _options?: any) {
      this.context = ctx
      this.http = {
        get: mockGet,
        getRaw: mockGetRaw,
        putRaw: mockPutRaw,
        delete: mockDelete,
        postRaw: mockPostRaw,
      }
    }
  },
}))

const mockCtx = {
  account: 'testaccount',
  workspace: 'master',
  authToken: 'test-auth-token',
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}

describe('ProductReviewClient', () => {
  let client: ProductReviewClient

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VTEX_APP_VENDOR = 'vtex'
    process.env.VTEX_APP_NAME = 'reviews-and-ratings'
    client = new ProductReviewClient(mockCtx as any)
  })

  describe('getProductReviewsAsync', () => {
    it('should return reviews on success', async () => {
      const mockReviews = [{ Id: 1, ProductId: '123', Rating: 5 }]

      mockGetRaw.mockResolvedValueOnce({ data: mockReviews })

      const result = await client.getProductReviewsAsync('123')

      expect(result).toEqual(mockReviews)
    })

    it('should return null on 404', async () => {
      mockGetRaw.mockRejectedValueOnce({ response: { status: 404 } })

      const result = await client.getProductReviewsAsync('nonexistent')

      expect(result).toBeNull()
    })

    it('should return null on error', async () => {
      mockGetRaw.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.getProductReviewsAsync('123')

      expect(result).toBeNull()
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })

  describe('deleteProductReviewMD', () => {
    it('should return true on success', async () => {
      // verifySchema call
      mockGetRaw.mockResolvedValueOnce({ data: '' })

      mockDelete.mockResolvedValueOnce(undefined)

      const result = await client.deleteProductReviewMD('doc-123')

      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      // verifySchema call
      mockGetRaw.mockResolvedValueOnce({ data: '' })

      mockDelete.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.deleteProductReviewMD('doc-123')

      expect(result).toBe(false)
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })

  describe('validateUserToken', () => {
    it('should return null for empty token', async () => {
      const result = await client.validateUserToken('')

      expect(result).toBeNull()
    })

    it('should return validated user on success', async () => {
      const mockUser = {
        authStatus: 'Success',
        id: 'user-123',
        user: 'test@test.com',
        account: 'testaccount',
        audience: 'admin',
        tokenType: 'user',
      }

      mockPostRaw.mockResolvedValueOnce({ status: 200, data: mockUser })

      const result = await client.validateUserToken('valid-token')

      expect(result).toEqual(mockUser)
    })

    it('should return null on error', async () => {
      mockPostRaw.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.validateUserToken('token')

      expect(result).toBeNull()
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })

  describe('getOrderInformation', () => {
    it('should return order on success', async () => {
      const mockOrder = { items: [{ productId: '123' }] }

      mockGet.mockResolvedValueOnce(mockOrder)

      const result = await client.getOrderInformation('order-123')

      expect(result).toEqual(mockOrder)
    })

    it('should return null on error', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.getOrderInformation('order-123')

      expect(result).toBeNull()
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })

  describe('listOrders', () => {
    it('should return order list on success', async () => {
      const mockList = { list: [{ orderId: 'order-1' }] }

      mockGet.mockResolvedValueOnce(mockList)

      const result = await client.listOrders('q=test@test.com')

      expect(result).toEqual(mockList)
    })

    it('should return empty list on error', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.listOrders('q=test@test.com')

      expect(result).toEqual({ list: [] })
    })
  })

  describe('validateLicenseManagerAccess', () => {
    it('should return true when user has access', async () => {
      mockGetRaw.mockResolvedValueOnce({ status: 200, data: 'true' })

      const result = await client.validateLicenseManagerAccess('user-123')

      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      mockGetRaw.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.validateLicenseManagerAccess('user-123')

      expect(result).toBe(false)
    })
  })

  describe('saveLookupAsync', () => {
    it('should be a no-op (returns immediately)', async () => {
      await client.saveLookupAsync({ 1: 'product1' })

      // No HTTP calls should be made
      expect(mockPutRaw).not.toHaveBeenCalled()
    })
  })
})
