import {
  AuthenticationError,
  ForbiddenError,
} from '@vtex/api'

import type { Clients } from '../../clients'
import type { SearchResponse, DataElement, Review } from '../../types'
import * as productReviewService from '../../services/productReview'

function throwOnAuthStatus(statusCode: number) {
  if (statusCode === 401) {
    throw new AuthenticationError('Unauthorized')
  }

  if (statusCode === 403) {
    throw new ForbiddenError('Forbidden')
  }

  if (statusCode === 400) {
    throw new AuthenticationError('BadRequest')
  }
}

export const queries = {
  review: async (
    _root: unknown,
    args: { id: string },
    ctx: { clients: Clients; vtex: any }
  ): Promise<Review | null> => {
    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return null
    }

    return productReviewService.getReview(ctx.clients.productReview, args.id)
  },

  reviews: async (
    _root: unknown,
    args: {
      searchTerm?: string
      from?: number
      to?: number
      orderBy?: string
      status?: string
    },
    ctx: { clients: Clients; vtex: any }
  ): Promise<SearchResponse> => {
    const searchTerm = args.searchTerm ?? ''
    const from = args.from ?? 0
    const to = (args.to ?? 9) + 1
    const orderBy = args.orderBy ?? ''
    const status = args.status ?? ''

    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return {
        data: { data: [] } as DataElement,
        range: { total: 0, from: 0, to: 0 },
      }
    }

    const searchResult = await productReviewService.getReviews(
      ctx.clients.productReview,
      searchTerm || null,
      from,
      to,
      orderBy || null,
      status || null,
      ctx.vtex.logger
    )

    return {
      data: { data: searchResult.reviews } as DataElement,
      range: searchResult.range,
    }
  },

  reviewsByProductId: async (
    _root: unknown,
    args: {
      productId: string
      rating?: number
      locale?: string
      pastReviews?: boolean
      searchTerm?: string
      from?: number
      to?: number
      orderBy?: string
      status?: string
    },
    ctx: { clients: Clients; vtex: any }
  ): Promise<SearchResponse> => {
    const productId = args.productId
    const rating = args.rating ?? 0
    const locale = args.locale ?? ''
    const pastReviews = args.pastReviews ?? false
    const searchTerm = args.searchTerm ?? ''
    const from = args.from ?? 0
    const to = (args.to ?? 9) + 1
    const orderBy = args.orderBy ?? ''

    const searchResult =
      await productReviewService.getReviewsByProductIdFull(
        ctx.clients.productReview,
        ctx.clients.appSettings,
        productId,
        from,
        to,
        orderBy,
        searchTerm,
        rating,
        locale,
        pastReviews,
        ctx.vtex.logger
      )

    const adminStatus = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (adminStatus !== 200 && searchResult.reviews) {
      for (const review of searchResult.reviews) {
        review.shopperId = null
      }
    }

    return {
      data: { data: searchResult.reviews } as DataElement,
      range: searchResult.range,
    }
  },

  averageRatingByProductId: async (
    _root: unknown,
    args: { productId: string },
    ctx: { clients: Clients; vtex: any }
  ) => {
    return productReviewService.getAverageRatingByProductId(
      ctx.clients.productReview,
      ctx.clients.appSettings,
      args.productId
    )
  },

  totalReviewsByProductId: async (
    _root: unknown,
    args: { productId: string },
    ctx: { clients: Clients; vtex: any }
  ): Promise<number> => {
    const searchResult = await productReviewService.getReviewsByProductId(
      ctx.clients.productReview,
      ctx.clients.appSettings,
      args.productId,
      ctx.vtex.logger
    )

    if (
      !searchResult?.reviews ||
      searchResult.reviews.length === 0
    ) {
      return 0
    }

    let count = searchResult.reviews.length
    const appSettingsData = await productReviewService.getAppSettings(
      ctx.clients.appSettings
    )

    if (appSettingsData.requireApproval) {
      count = searchResult.reviews.filter((x) => x.approved === true).length
    }

    return count
  },

  reviewsByShopperId: async (
    _root: unknown,
    args: {
      shopperId: string
      searchTerm?: string
      from?: number
      to?: number
      orderBy?: string
      status?: string
    },
    ctx: { clients: Clients; vtex: any }
  ): Promise<SearchResponse> => {
    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return {
        data: { data: [] } as DataElement,
        range: { total: 0, from: 0, to: 0 },
      }
    }

    const searchResult = await productReviewService.getReviewsByShopperId(
      ctx.clients.productReview,
      args.shopperId
    )

    return {
      data: { data: searchResult.reviews } as DataElement,
      range: searchResult.range,
    }
  },

  reviewByreviewDateTime: async (
    _root: unknown,
    args: {
      reviewDateTime: string
      from?: number
      to?: number
      orderBy?: string
      status?: string
    },
    ctx: { clients: Clients; vtex: any }
  ): Promise<SearchResponse> => {
    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return {
        data: { data: [] } as DataElement,
        range: { total: 0, from: 0, to: 0 },
      }
    }

    const searchResult =
      await productReviewService.getReviewsByreviewDateTime(
        ctx.clients.productReview,
        args.reviewDateTime
      )

    return {
      data: { data: searchResult.reviews } as DataElement,
      range: searchResult.range,
    }
  },

  reviewByDateRange: async (
    _root: unknown,
    args: {
      fromDate: string
      toDate: string
      orderBy?: string
      status?: string
    },
    ctx: { clients: Clients; vtex: any }
  ): Promise<SearchResponse> => {
    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return {
        data: { data: [] } as DataElement,
        range: { total: 0, from: 0, to: 0 },
      }
    }

    const searchResult = await productReviewService.getReviewsByDateRange(
      ctx.clients.productReview,
      args.fromDate,
      args.toDate
    )

    return {
      data: { data: searchResult.reviews } as DataElement,
      range: searchResult.range,
    }
  },

  hasShopperReviewed: async (
    _root: unknown,
    args: { shopperId: string; productId: string },
    ctx: { clients: Clients; vtex: any }
  ): Promise<boolean> => {
    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return false
    }

    return productReviewService.hasShopperReviewed(
      ctx.clients.productReview,
      args.shopperId,
      args.productId
    )
  },

  appSettings: async (
    _root: unknown,
    _args: unknown,
    ctx: { clients: Clients }
  ) => {
    return productReviewService.getAppSettings(ctx.clients.appSettings)
  },

  verifySchema: async (
    _root: unknown,
    _args: unknown,
    ctx: { clients: Clients }
  ): Promise<string> => {
    return productReviewService.verifySchema(ctx.clients.productReview)
  },

  migrateData: async (
    _root: unknown,
    _args: unknown,
    ctx: { clients: Clients; vtex: any }
  ): Promise<string | null> => {
    const statusCode = await productReviewService.isAdminAuthUser(
      ctx.clients.productReview,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.account,
      ctx.vtex.logger
    )

    if (statusCode !== 200) {
      throwOnAuthStatus(statusCode)

      return null
    }

    return productReviewService.migrateData(
      ctx.clients.productReview,
      ctx.clients.appSettings,
      ctx.vtex.logger
    )
  },

  verifyMigration: async (
    _root: unknown,
    _args: unknown,
    ctx: { clients: Clients }
  ): Promise<string> => {
    return productReviewService.verifyMigration(ctx.clients.productReview)
  },

  successfulMigration: async (
    _root: unknown,
    _args: unknown,
    ctx: { clients: Clients }
  ): Promise<string> => {
    return productReviewService.successfulMigration(ctx.clients.productReview)
  },
}
