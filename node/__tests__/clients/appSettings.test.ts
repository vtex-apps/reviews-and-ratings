import { AppSettingsClient } from '../../clients/appSettings'

const mockGet = jest.fn()

jest.mock('@vtex/api', () => ({
  ExternalClient: class {
    context: any
    http: any
    constructor(baseURL: string, ctx: any, _options?: any) {
      this.context = ctx
      this.http = { get: mockGet }
    }
  },
}))

const mockCtx = {
  account: 'testaccount',
  workspace: 'master',
  authToken: 'test-token',
  region: 'aws-us-east-1',
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}

describe('AppSettingsClient', () => {
  let client: AppSettingsClient

  beforeEach(() => {
    jest.clearAllMocks()
    client = new AppSettingsClient(mockCtx as any)
  })

  describe('getAppSettingAsync', () => {
    it('should return app settings on success', async () => {
      const mockSettings = {
        allowAnonymousReviews: true,
        requireApproval: false,
        useLocation: true,
        defaultOpen: true,
        defaultStarsRating: 5,
        defaultOpenCount: 0,
        showGraph: false,
        displaySummaryIfNone: false,
        displayInlineIfNone: false,
        displaySummaryTotalReviews: true,
        displaySummaryAddButton: false,
      }

      mockGet.mockResolvedValueOnce(mockSettings)

      const result = await client.getAppSettingAsync()

      expect(result).toEqual(mockSettings)
      expect(mockGet).toHaveBeenCalledTimes(1)
    })

    it('should return default settings on 404', async () => {
      const error = { response: { status: 404 } }

      mockGet.mockRejectedValueOnce(error)

      const result = await client.getAppSettingAsync()

      expect(result.allowAnonymousReviews).toBe(false)
      expect(result.requireApproval).toBe(false)
    })

    it('should return default settings on error', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.getAppSettingAsync()

      expect(result.allowAnonymousReviews).toBe(false)
      expect(mockCtx.logger.error).toHaveBeenCalled()
    })

    it('should return default settings when response is null', async () => {
      mockGet.mockResolvedValueOnce(null)

      const result = await client.getAppSettingAsync()

      expect(result.allowAnonymousReviews).toBe(false)
      expect(result.requireApproval).toBe(false)
    })
  })
})
