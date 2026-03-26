import {
  AuthenticationError,
  ForbiddenError,
} from '@vtex/api'

import type { Clients } from '../../clients'
import type { Review } from '../../types'
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

export const mutations = {
  newReview: async (
    _root: unknown,
    args: { review: Review },
    ctx: { clients: Clients; vtex: any; headers?: Record<string, string | string[] | undefined> }
  ): Promise<Review | null> => {
    const appSettingsData = await productReviewService.getAppSettings(
      ctx.clients.appSettings
    )

    if (!appSettingsData.allowAnonymousReviews) {
      const statusCode = await productReviewService.isValidAuthUser(
        ctx.clients.productReview,
        ctx.vtex.storeUserAuthToken,
        ctx.vtex.adminUserAuthToken,
        ctx.headers?.vtexidclientautcookie as string | undefined,
        ctx.vtex.logger
      )

      if (statusCode !== 200) {
        throwOnAuthStatus(statusCode)

        return null
      }
    }

    return productReviewService.newReview(
      ctx.clients.productReview,
      ctx.clients.appSettings,
      args.review,
      true,
      ctx.vtex.storeUserAuthToken,
      ctx.vtex.logger
    )
  },

  editReview: async (
    _root: unknown,
    args: { id: string; review: Review },
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

    const review = args.review

    review.id = args.id

    return productReviewService.editReview(ctx.clients.productReview, review)
  },

  deleteReview: async (
    _root: unknown,
    args: { ids: string[] },
    ctx: { clients: Clients; vtex: any }
  ): Promise<boolean | null> => {
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

    return productReviewService.deleteReview(
      ctx.clients.productReview,
      args.ids
    )
  },

  moderateReview: async (
    _root: unknown,
    args: { ids: string[]; approved: boolean },
    ctx: { clients: Clients; vtex: any }
  ): Promise<boolean | null> => {
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

    return productReviewService.moderateReview(
      ctx.clients.productReview,
      args.ids,
      args.approved
    )
  },
}
