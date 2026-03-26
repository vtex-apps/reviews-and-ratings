import { addSearchDateHandler } from '../../handlers/addSearchDate'

jest.mock('../../services/productReview', () => ({
  addSearchDate: jest.fn(),
}))

import * as productReviewService from '../../services/productReview'

describe('addSearchDateHandler', () => {
  const createCtx = (): any => ({
    clients: {
      productReview: {},
    },
    vtex: {
      logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(), log: jest.fn() },
    },
    status: 0,
    body: null,
    set: jest.fn(),
  })

  it('should return Done on success', async () => {
    const ctx = createCtx()
    const next = jest.fn()

    ;(productReviewService.addSearchDate as jest.Mock).mockResolvedValueOnce(undefined)

    await addSearchDateHandler(ctx, next)

    expect(ctx.status).toBe(200)
    expect(ctx.body).toBe('Done')
    expect(next).toHaveBeenCalled()
  })

  it('should return False on error', async () => {
    const ctx = createCtx()
    const next = jest.fn()

    ;(productReviewService.addSearchDate as jest.Mock).mockRejectedValueOnce(new Error('fail'))

    await addSearchDateHandler(ctx, next)

    expect(ctx.status).toBe(200)
    expect(ctx.body).toBe('False')
    expect(next).toHaveBeenCalled()
  })
})
