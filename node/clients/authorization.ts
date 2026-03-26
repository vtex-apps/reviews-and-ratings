import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import type {
  ValidatedKeyAndToken,
  ValidatedUser,
  ValidateKeyAndToken,
  ValidateToken,
} from '../types'
import { ENVIRONMENT } from '../utils/constants'

const APPLICATION_JSON = 'application/json'

export class AuthorizationClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async validateUserToken(
    token: string
  ): Promise<ValidatedUser | null> {
    if (!token || !this.context.account) {
      return null
    }

    const body: ValidateToken = { Token: token }

    try {
      const response = await this.http.postRaw<ValidatedUser>(
        `/api/vtexid/credential/validate`,
        body,
        {
          headers: {
            Authorization: this.context.authToken,
            'Content-Type': APPLICATION_JSON,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'auth-validate-token',
        }
      )

      if (response.status >= 200 && response.status < 300) {
        return response.data
      }

      return null
    } catch (err: any) {
      this.context.logger.error({
        message: 'validateUserToken error',
        error: err,
      })

      return null
    }
  }

  public async validateLicenseManagerAccess(
    userId: string
  ): Promise<boolean> {
    if (
      !this.context.account ||
      !this.context.authToken ||
      !userId
    ) {
      return false
    }

    try {
      const response = await this.http.getRaw(
        `http://licensemanager.${ENVIRONMENT}.com.br/api/license-manager/pvt/accounts/${this.context.account}/logins/${userId}/granted`,
        {
          headers: {
            Authorization: this.context.authToken,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'auth-license-manager',
        }
      )

      this.context.logger.info({
        message: `validateLicenseManagerAccess [${response.status}]`,
        userId,
      })

      return (
        response.status >= 200 &&
        response.status < 300 &&
        String(response.data) === 'true'
      )
    } catch (err: any) {
      this.context.logger.error({
        message: `validateLicenseManagerAccess error for user '${userId}'`,
        error: err,
      })

      return false
    }
  }

  public async getAppkeyToken(
    appkey: string,
    apptoken: string
  ): Promise<ValidatedKeyAndToken | null> {
    if (!appkey || !apptoken || !this.context.account) {
      return null
    }

    const body: ValidateKeyAndToken = {
      appKey: appkey,
      appToken: apptoken,
    }

    try {
      const response = await this.http.postRaw<ValidatedKeyAndToken>(
        `/api/vtexid/apptoken/login`,
        body,
        {
          headers: {
            Authorization: this.context.authToken,
            'Content-Type': APPLICATION_JSON,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'auth-appkey-token',
        }
      )

      if (response.status >= 200 && response.status < 300) {
        return response.data
      }

      return null
    } catch (err: any) {
      this.context.logger.error({
        message: 'getAppkeyToken error',
        error: err,
      })

      return null
    }
  }
}
