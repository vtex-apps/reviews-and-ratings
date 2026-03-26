import { verifySchemaHandler } from '../../handlers/verifySchema'

jest.mock('../../services/productReview', () => ({
  verifySchema: jest.fn().mockResolvedValue('Schema is up to date!'),
}))

describe('verifySchemaHandler', () => {
  const mockCtx: any = {
    clients: {
      productReview: {},
    },
    vtex: {
      logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(), log: jest.fn() },
    },
    status: 0,
    body: null,
    set: jest.fn(),
  }

  it('should set status 200 and return schema result', async () => {
    const next = jest.fn()

    await verifySchemaHandler(mockCtx, next)

    expect(mockCtx.status).toBe(200)
    expect(mockCtx.body).toBe('Schema is up to date!')
    expect(next).toHaveBeenCalled()
  })
})
