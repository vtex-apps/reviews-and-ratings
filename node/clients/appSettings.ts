import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { AppSettings } from '../types'
import { APP_SETTINGS } from '../utils/constants'

export class AppSettingsClient extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    const region = process.env.VTEX_REGION ?? ctx.region

    super(
      `http://apps.${region}.vtex.io`,
      ctx,
      {
        ...options,
        headers: {
          ...options?.headers,
          'X-Vtex-Use-Https': 'true',
        },
      }
    )
  }

  public async getAppSettingAsync(): Promise<AppSettings> {
    const defaultSettings: AppSettings = {
      allowAnonymousReviews: false,
      requireApproval: false,
      useLocation: false,
      defaultOpen: true,
      defaultStarsRating: 5,
      defaultOpenCount: 0,
      showGraph: false,
      displaySummaryIfNone: false,
      displayInlineIfNone: false,
      displaySummaryTotalReviews: true,
      displaySummaryAddButton: false,
    }

    try {
      const response = await this.http.get<AppSettings>(
        `/${this.context.account}/${this.context.workspace}/apps/${APP_SETTINGS}/settings`,
        {
          headers: {
            Authorization: this.context.authToken,
          },
          metric: 'app-settings-get',
        }
      )

      return response ?? defaultSettings
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return defaultSettings
      }

      this.context.logger.error({
        message: 'getAppSettingAsync error',
        error: err,
      })

      return defaultSettings
    }
  }
}
