import { AuthorizationClient } from '../../clients/authorization'

const mockPostRaw = jest.fn()
const mockGetRaw = jest.fn()

jest.mock('@vtex/api', () => ({
  JanusClient: class {
    context: any
    http: any
    constructor(ctx: any, _options?: any) {
      this.context = ctx
      this.http = { postRaw: mockPostRaw, getRaw: mockGetRaw }
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

describe('AuthorizationClient', () => {
  let client: AuthorizationClient

  beforeEach(() => {
    jest.clearAllMocks()
    client = new AuthorizationClient(mockCtx as any)
  })

  describe('validateUserToken', () => {
    it('should return null for empty token', async () => {
      const result = await client.validateUserToken('')

      expect(result).toBeNull()
      expect(mockPostRaw).not.toHaveBeenCalled()
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

      mockPostRaw.mockResolvedValueOnce({
        status: 200,
        data: mockUser,
      })

      const result = await client.validateUserToken('valid-token')

      expect(result).toEqual(mockUser)
      expect(mockPostRaw).toHaveBeenCalledTimes(1)
    })

    it('should return null on non-success status', async () => {
      mockPostRaw.mockResolvedValueOnce({
        status: 401,
        data: null,
      })

      const result = await client.validateUserToken('invalid-token')

      expect(result).toBeNull()
    })

    it('should return null on error', async () => {
      mockPostRaw.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.validateUserToken('some-token')

      expect(result).toBeNull()
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })

  describe('validateLicenseManagerAccess', () => {
    it('should return false for empty userId', async () => {
      const result = await client.validateLicenseManagerAccess('')

      expect(result).toBe(false)
    })

    it('should return true when user has access', async () => {
      mockGetRaw.mockResolvedValueOnce({
        status: 200,
        data: 'true',
      })

      const result = await client.validateLicenseManagerAccess('user-123')

      expect(result).toBe(true)
    })

    it('should return false when user does not have access', async () => {
      mockGetRaw.mockResolvedValueOnce({
        status: 200,
        data: 'false',
      })

      const result = await client.validateLicenseManagerAccess('user-123')

      expect(result).toBe(false)
    })

    it('should return false on error', async () => {
      mockGetRaw.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.validateLicenseManagerAccess('user-123')

      expect(result).toBe(false)
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })

  describe('getAppkeyToken', () => {
    it('should return null for empty appkey', async () => {
      const result = await client.getAppkeyToken('', 'token')

      expect(result).toBeNull()
    })

    it('should return null for empty apptoken', async () => {
      const result = await client.getAppkeyToken('key', '')

      expect(result).toBeNull()
    })

    it('should return validated key and token on success', async () => {
      const mockResponse = {
        authStatus: 'Success',
        token: 'generated-token',
        expires: '2026-12-31',
      }

      mockPostRaw.mockResolvedValueOnce({
        status: 200,
        data: mockResponse,
      })

      const result = await client.getAppkeyToken('key', 'token')

      expect(result).toEqual(mockResponse)
    })

    it('should return null on error', async () => {
      mockPostRaw.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.getAppkeyToken('key', 'token')

      expect(result).toBeNull()
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })
  })
})
