import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import type {
  LegacyReview,
  Review,
  ReviewsResponseWrapper,
  ValidatedUser,
  ValidateToken,
  VtexOrder,
  VtexOrderList,
} from '../types'
import {
  DATA_ENTITY,
  ENVIRONMENT,
  HASHED_SCHEMA,
  LOOKUP,
  REVIEWS_BUCKET,
  SCHEMA,
  SCHEMA_JSON,
  SUCCESSFUL_MIGRATION,
} from '../utils/constants'
import { getSHA256 } from '../utils/hash'

const APPLICATION_JSON = 'application/json'

export class ProductReviewClient extends JanusClient {
  private applicationName: string

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Vtex-Use-Https': 'true',
      },
    })

    const vendor = process.env.VTEX_APP_VENDOR ?? 'vtex'
    const appName = process.env.VTEX_APP_NAME ?? 'reviews-and-ratings'

    this.applicationName = `${vendor}.${appName}`
  }

  // ============ VBase Operations (Legacy Reviews) ============

  public async getProductReviewsAsync(
    productId: string
  ): Promise<LegacyReview[] | null> {
    try {
      const response = await this.http.getRaw(
        `http://infra.io.vtex.com/vbase/v2/${this.context.account}/master/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${productId}`,
        {
          headers: {
            Authorization: this.context.authToken,
          },
          metric: 'vbase-get-product-reviews',
        }
      )

      return response.data as LegacyReview[]
    } catch (err: any) {
      if (err?.response?.status === 404) {
        this.context.logger.info({
          message: 'getProductReviewsAsync: not found',
          productId,
        })

        return null
      }

      this.context.logger.error({
        message: 'getProductReviewsAsync error',
        error: err,
        productId,
      })

      return null
    }
  }

  public async saveProductReviewsAsync(
    productId: string,
    productReviews: LegacyReview[] | null
  ): Promise<void> {
    const data = productReviews ?? []

    try {
      await this.http.putRaw(
        `http://infra.io.vtex.com/vbase/v2/${this.context.account}/${this.context.workspace}/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${productId}`,
        data,
        {
          headers: {
            Authorization: this.context.authToken,
            'Content-Type': APPLICATION_JSON,
          },
          metric: 'vbase-save-product-reviews',
        }
      )
    } catch (err: any) {
      this.context.logger.error({
        message: 'saveProductReviewsAsync error',
        error: err,
        productId,
      })
    }
  }

  public async loadLookupAsync(): Promise<Record<
    number,
    string
  > | null> {
    try {
      const response = await this.http.getRaw(
        `http://infra.io.vtex.com/vbase/v2/${this.context.account}/${this.context.workspace}/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${LOOKUP}`,
        {
          headers: {
            Authorization: this.context.authToken,
          },
          metric: 'vbase-load-lookup',
        }
      )

      return response.data as Record<number, string>
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return null
      }

      this.context.logger.error({
        message: 'loadLookupAsync request error',
        error: err,
      })

      return null
    }
  }

  public async saveLookupAsync(
    _lookupDictionary: Record<number, string> | null
  ): Promise<void> {
    // The original C# code has an early return here, making this a no-op
    return
  }

  // ============ MasterData Operations ============

  public async getProductReviewsMD(
    searchQuery: string,
    from: string | null,
    to: string | null
  ): Promise<ReviewsResponseWrapper> {
    await this.verifySchema()

    let reviews: Review[] = []
    let total = '0'
    let responseFrom = '0'
    let responseTo = '0'

    try {
      const fromVal = from ?? '0'
      const toVal = to ?? '300'

      let query = searchQuery

      if (query && !query.startsWith('&')) {
        query = `&${query}`
      }

      const url = `/api/dataentities/${DATA_ENTITY}/search?_fields=_all&_schema=${SCHEMA}${query}`

      const response = await this.http.getRaw(url, {
        headers: {
          Authorization: this.context.authToken,
          VtexIdclientAutCookie: this.context.authToken,
          'Proxy-Authorization': this.context.authToken,
          'REST-Range': `resources=${fromVal}-${toVal}`,
          'X-Vtex-Use-Https': 'true',
        },
        metric: 'md-get-reviews',
      })

      if (response.status >= 200 && response.status < 300) {
        reviews = response.data as Review[]
      } else {
        this.context.logger.error({
          message: 'getProductReviewsMD error response',
          searchQuery,
          from: fromVal,
          to: toVal,
          status: response.status,
        })
      }

      const contentRange =
        response.headers?.['rest-content-range'] as string | undefined

      if (contentRange) {
        // Format: "resources 0-10/168"
        const parts = contentRange.split(' ')
        const ranges = parts[1]
        const splitRanges = ranges.split('/')

        total = splitRanges[1]
        const fromTo = splitRanges[0].split('-')

        responseFrom = fromTo[0]
        responseTo = fromTo[1]
      }
    } catch (err: any) {
      if (err?.message?.includes('cancelled') || err?.code === 'ECONNABORTED') {
        this.context.logger.warn({
          message: 'getProductReviewsMD task cancelled',
          searchQuery,
          from,
          to,
        })
      } else {
        this.context.logger.error({
          message: 'getProductReviewsMD error',
          error: err,
          searchQuery,
          from,
          to,
        })
      }
    }

    return {
      reviews,
      range: {
        from: parseInt(responseFrom, 10),
        to: parseInt(responseTo, 10),
        total: parseInt(total, 10),
      },
    }
  }

  public async getRangeReviewsMD(
    fromDate: string,
    toDate: string
  ): Promise<ReviewsResponseWrapper> {
    await this.verifySchema()

    let reviews: Review[] = []
    let total = '0'
    let responseFrom = '0'
    let responseTo = '0'

    let parsedFromDate = new Date(fromDate).toISOString()
    let adjustedToDate = toDate

    if (!adjustedToDate.includes(' ')) {
      adjustedToDate = `${adjustedToDate} 23:59:59`
    }

    let parsedToDate = new Date(adjustedToDate).toISOString()

    parsedFromDate = encodeURIComponent(parsedFromDate)
    parsedToDate = encodeURIComponent(parsedToDate)

    try {
      const url = `/api/dataentities/${DATA_ENTITY}/search?_fields=_all&_schema=${SCHEMA}&_where=searchDate between ${parsedFromDate} AND ${parsedToDate}`

      const response = await this.http.getRaw(url, {
        headers: {
          Authorization: this.context.authToken,
          VtexIdclientAutCookie: this.context.authToken,
          'Proxy-Authorization': this.context.authToken,
          'REST-Range': 'resources=0-800',
          'X-Vtex-Use-Https': 'true',
        },
        metric: 'md-get-range-reviews',
      })

      if (response.status >= 200 && response.status < 300) {
        reviews = response.data as Review[]
      }

      const contentRange =
        response.headers?.['rest-content-range'] as string | undefined

      if (contentRange) {
        const parts = contentRange.split(' ')
        const ranges = parts[1]
        const splitRanges = ranges.split('/')

        total = splitRanges[1]
        const fromTo = splitRanges[0].split('-')

        responseFrom = fromTo[0]
        responseTo = fromTo[1]
      }
    } catch (err: any) {
      this.context.logger.error({
        message: 'getRangeReviewsMD error',
        error: err,
        fromDate,
        toDate,
      })
    }

    return {
      reviews,
      range: {
        from: parseInt(responseFrom, 10),
        to: parseInt(responseTo, 10),
        total: parseInt(total, 10),
      },
    }
  }

  public async saveProductReviewMD(review: Review): Promise<string> {
    await this.verifySchema()
    let id = ''

    // Set searchDate if empty
    if (!review.searchDate) {
      let searchDate: Date | null = null

      if (review.reviewDateTime) {
        const parsed = new Date(review.reviewDateTime)

        if (!isNaN(parsed.getTime())) {
          searchDate = parsed
        }
      }

      if (!searchDate) {
        searchDate = new Date()
      }

      review.searchDate = searchDate.toISOString()
    }

    try {
      const response = await this.http.putRaw<{ DocumentId: string }>(
        `/api/dataentities/${DATA_ENTITY}/documents?_schema=${SCHEMA}`,
        review,
        {
          headers: {
            Authorization: this.context.authToken,
            VtexIdclientAutCookie: this.context.authToken,
            'Proxy-Authorization': this.context.authToken,
            'Content-Type': APPLICATION_JSON,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'md-save-review',
        }
      )

      if (response.status >= 200 && response.status < 300) {
        const savedReview = response.data

        id = savedReview.DocumentId
      } else {
        this.context.logger.warn({
          message: `saveProductReviewMD: did not save review [${response.status}]`,
          review,
        })
      }
    } catch (err: any) {
      this.context.logger.error({
        message: 'saveProductReviewMD error',
        error: err,
        review,
      })
    }

    return id
  }

  public async deleteProductReviewMD(documentId: string): Promise<boolean> {
    await this.verifySchema()

    try {
      await this.http.delete(
        `/api/dataentities/${DATA_ENTITY}/documents/${documentId}`,
        {
          headers: {
            Authorization: this.context.authToken,
            VtexIdclientAutCookie: this.context.authToken,
            'Proxy-Authorization': this.context.authToken,
          },
          metric: 'md-delete-review',
        }
      )

      return true
    } catch (err: any) {
      this.context.logger.error({
        message: 'deleteProductReviewMD error',
        error: err,
        documentId,
      })

      return false
    }
  }

  // ============ Schema Verification ============

  public async verifySchema(): Promise<string> {
    let verifyResult = false

    try {
      let storedHash: string | null = null

      try {
        const response = await this.http.getRaw(
          `http://infra.io.vtex.com/vbase/v2/${this.context.account}/master/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${HASHED_SCHEMA}`,
          {
            headers: {
              Authorization: this.context.authToken,
              'X-Vtex-Use-Https': 'true',
            },
            metric: 'vbase-verify-schema-get',
          }
        )

        storedHash = typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      } catch (e: any) {
        if (e?.response?.status !== 404) {
          throw e
        }
      }

      const currentHash = getSHA256(SCHEMA_JSON)

      verifyResult = storedHash === currentHash

      if (!verifyResult) {
        // Apply schema to MasterData
        const schemaResponse = await this.http.putRaw(
          `/api/dataentities/${DATA_ENTITY}/schemas/${SCHEMA}`,
          JSON.parse(SCHEMA_JSON),
          {
            headers: {
              'Proxy-Authorization': this.context.authToken,
              VtexIdclientAutCookie: this.context.authToken,
              'Content-Type': APPLICATION_JSON,
              'X-Vtex-Use-Https': 'true',
            },
            metric: 'md-put-schema',
          }
        )

        if (
          schemaResponse.status < 200 ||
          (schemaResponse.status >= 300 && schemaResponse.status !== 304)
        ) {
          this.context.logger.error({
            message: `verifySchema: Failed to apply schema [${schemaResponse.status}]`,
          })

          return 'Schema is NOT up to date'
        }

        // Save hash to VBase
        const hashResponse = await this.http.putRaw(
          `http://infra.io.vtex.com/vbase/v2/${this.context.account}/master/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${HASHED_SCHEMA}`,
          JSON.stringify(currentHash),
          {
            headers: {
              'Proxy-Authorization': this.context.authToken,
              VtexIdclientAutCookie: this.context.authToken,
              'Content-Type': APPLICATION_JSON,
              'X-Vtex-Use-Https': 'true',
            },
            metric: 'vbase-put-schema-hash',
          }
        )

        verifyResult = hashResponse.status === 200
        if (!verifyResult) {
          this.context.logger.warn({
            message: `verifySchema: Failed to update schema hash [${hashResponse.status}]`,
          })
        }
      }
    } catch (err: any) {
      this.context.logger.error({
        message: 'verifySchema error',
        error: err,
      })
    }

    return verifyResult ? 'Schema is up to date!' : 'Schema is NOT up to date'
  }

  public async verifyMigration(): Promise<string> {
    try {
      const response = await this.http.getRaw(
        `http://infra.io.vtex.com/vbase/v2/${this.context.account}/master/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${SUCCESSFUL_MIGRATION}`,
        {
          headers: {
            Authorization: this.context.authToken,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'vbase-verify-migration',
        }
      )

      return String(response.data)
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return '0'
      }

      this.context.logger.error({
        message: 'verifyMigration error',
        error: err,
      })

      return '0'
    }
  }

  public async successfulMigration(): Promise<string> {
    try {
      const response = await this.http.putRaw(
        `http://infra.io.vtex.com/vbase/v2/${this.context.account}/master/buckets/${this.applicationName}/${REVIEWS_BUCKET}/files/${SUCCESSFUL_MIGRATION}`,
        JSON.stringify('1'),
        {
          headers: {
            'Proxy-Authorization': this.context.authToken,
            VtexIdclientAutCookie: this.context.authToken,
            'Content-Type': APPLICATION_JSON,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'vbase-successful-migration',
        }
      )

      return String(response.data)
    } catch (err: any) {
      this.context.logger.error({
        message: 'successfulMigration error',
        error: err,
      })

      return err?.message ?? 'Error'
    }
  }

  // ============ OMS Operations ============

  public async getOrderInformation(orderId: string): Promise<VtexOrder | null> {
    try {
      return await this.http.get(
        `/api/oms/pvt/orders/${orderId}`,
        {
          headers: {
            Authorization: this.context.authToken,
            VtexIdclientAutCookie: this.context.authToken,
            'Proxy-Authorization': this.context.authToken,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'oms-get-order',
        }
      )
    } catch (err: any) {
      this.context.logger.error({
        message: 'getOrderInformation error',
        error: err,
        orderId,
      })

      return null
    }
  }

  public async listOrders(queryString: string): Promise<VtexOrderList> {
    try {
      return await this.http.get(
        `/api/oms/pvt/orders?${queryString}`,
        {
          headers: {
            Authorization: this.context.authToken,
            VtexIdclientAutCookie: this.context.authToken,
            'Proxy-Authorization': this.context.authToken,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'oms-list-orders',
        }
      )
    } catch (err: any) {
      this.context.logger.error({
        message: 'listOrders error',
        error: err,
        queryString,
      })

      return { list: [] }
    }
  }

  // ============ VTEX ID Operations ============

  public async validateUserToken(
    token: string
  ): Promise<ValidatedUser | null> {
    if (!token) {
      return null
    }

    const body: ValidateToken = { Token: token }

    try {
      const response = await this.http.postRaw<ValidatedUser>(
        `/api/vtexid/credential/validate`,
        body,
        {
          headers: {
            Authorization:
              this.context.authToken,
            'Content-Type': APPLICATION_JSON,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'vtexid-validate-token',
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

  // ============ License Manager ============

  public async validateLicenseManagerAccess(
    userId: string
  ): Promise<boolean> {
    try {
      const response = await this.http.getRaw(
        `http://licensemanager.${ENVIRONMENT}.com.br/api/license-manager/pvt/accounts/${this.context.account}/logins/${userId}/granted`,
        {
          headers: {
            Authorization: this.context.authToken,
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'license-manager-validate',
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
}
