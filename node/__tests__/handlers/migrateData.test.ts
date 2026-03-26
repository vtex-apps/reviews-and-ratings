jest.mock('co-body', () => ({
  json: jest.fn(),
}))

jest.mock('../../services/productReview', () => ({
  migrateData: jest.fn(),
  migrateDataByProductIds: jest.fn(),
  verifySchema: jest.fn(),
}))

jest.mock('../../services/authorization', () => ({
  retrieveAuthenticatedUser: jest.fn(),
  validateLicenseManagerAccess: jest.fn(),
}))

import { migrateDataHandler } from '../../handlers/migrateData'
import * as authorizationService from '../../services/authorization'
import * as productReviewService from '../../services/productReview'
import { json } from 'co-body'

describe('migrateDataHandler', () => {
  const createCtx = (method: string): any => ({
    clients: {
      productReview: {},
      appSettings: {},
      authorization: {},
    },
    vtex: {
      logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(), log: jest.fn() },
      adminUserAuthToken: 'admin-token',
      storeUserAuthToken: 'store-token',
    },
    headers: {},
    method,
    req: {},
    status: 0,
    body: null,
    set: jest.fn(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when user is not admin', async () => {
    const ctx = createCtx('GET')
    const next = jest.fn()

    ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null)

    await migrateDataHandler(ctx, next)

    expect(ctx.status).toBe(401)
    expect(ctx.body).toBe('Invalid User')
  })

  it('should call migrateData on GET when user is admin', async () => {
    const ctx = createCtx('GET')
    const next = jest.fn()

    ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce({
      id: 'user-1',
      user: 'admin@test.com',
      authStatus: 'Success',
    })
    ;(authorizationService.validateLicenseManagerAccess as jest.Mock).mockResolvedValueOnce(true)
    ;(productReviewService.migrateData as jest.Mock).mockResolvedValueOnce('Migration complete')

    await migrateDataHandler(ctx, next)

    expect(ctx.status).toBe(200)
    expect(ctx.body).toBe('Migration complete')
    expect(productReviewService.migrateData).toHaveBeenCalled()
  })

  it('should call migrateDataByProductIds on POST when user is admin', async () => {
    const ctx = createCtx('POST')
    const next = jest.fn()

    ;(authorizationService.retrieveAuthenticatedUser as jest.Mock).mockResolvedValueOnce({
      id: 'user-1',
      user: 'admin@test.com',
      authStatus: 'Success',
    })
    ;(authorizationService.validateLicenseManagerAccess as jest.Mock).mockResolvedValueOnce(true)
    ;(json as jest.Mock).mockResolvedValueOnce(['product-1', 'product-2'])
    ;(productReviewService.migrateDataByProductIds as jest.Mock).mockResolvedValueOnce('Done')

    await migrateDataHandler(ctx, next)

    expect(ctx.status).toBe(200)
    expect(ctx.body).toBe('Done')
    expect(productReviewService.migrateDataByProductIds).toHaveBeenCalled()
  })
})
