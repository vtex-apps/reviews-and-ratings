import { json } from 'co-body'
import type { ServiceContext, RecorderState, ParamsContext } from '@vtex/api'

import type { Clients } from '../clients'
import type {
  Review,
  SearchResponse,
  DataElement,
  RatingResponse,
} from '../types'
import {
  REVIEW,
  REVIEWS,
  RATING,
} from '../utils/constants'
import * as productReviewService from '../services/productReview'
import * as authorizationService from '../services/authorization'

type Context = ServiceContext<Clients, RecorderState, ParamsContext>

async function processReviewApiAction(
  ctx: Context,
  requestedAction: string,
  id: string | null
) {
  const { logger } = ctx.vtex
  const {
    clients: { productReview, appSettings, authorization },
  } = ctx

  if (!requestedAction) {
    ctx.status = 400
    ctx.body = 'Missing parameter'

    return
  }

  await productReviewService.verifySchema(productReview)

  ctx.set('Cache-Control', 'private, no-store')

  const authenticatedUser =
    await authorizationService.retrieveAuthenticatedUser(
      authorization,
      ctx.headers,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.storeUserAuthToken,
      logger
    )

  let isValidAdminUser = false
  let isUserValidated = false

  if (authenticatedUser) {
    isValidAdminUser =
      await authorizationService.validateLicenseManagerAccess(
        authorization,
        authenticatedUser.id
      )

    isUserValidated = true
  }

  const method = ctx.method.toLowerCase()

  if (method === 'post') {
    const bodyAsText = await json(ctx.req)

    switch (requestedAction) {
      case REVIEW: {
        if (!isUserValidated) {
          ctx.status = 401
          ctx.body = 'Invalid User'

          return
        }

        const newReview = bodyAsText as Review

        if (!newReview.productId) {
          ctx.status = 400
          ctx.body = 'ProductId is missing.'

          return
        }

        if (newReview.rating == null) {
          ctx.status = 400
          ctx.body = 'Rating is missing.'

          return
        }

        if (!newReview.title) {
          ctx.status = 400
          ctx.body = 'Title is missing.'

          return
        }

        if (!newReview.text) {
          ctx.status = 400
          ctx.body = 'Text is missing.'

          return
        }

        if (!newReview.reviewerName) {
          ctx.status = 400
          ctx.body = 'ReviewerName is missing.'

          return
        }

        if (newReview.approved == null) {
          ctx.status = 400
          ctx.body = 'Approved is missing.'

          return
        }

        const hasReviewed = await productReviewService.hasShopperReviewed(
          productReview,
          authenticatedUser!.user,
          newReview.productId
        )

        if (hasReviewed) {
          ctx.status = 200
          ctx.body = 'Duplicate Review'

          return
        }

        const hasShopperPurchased =
          await productReviewService.shopperHasPurchasedProduct(
            productReview,
            authenticatedUser!.user,
            newReview.productId,
            logger
          )

        const reviewToSave: Review = {
          productId: newReview.productId,
          rating: newReview.rating,
          shopperId: authenticatedUser!.user,
          title: newReview.title,
          text: newReview.text,
          reviewerName: newReview.reviewerName,
          reviewDateTime: newReview.reviewDateTime,
          verifiedPurchaser: hasShopperPurchased,
          approved: newReview.approved,
        }

        const reviewResponse = await productReviewService.newReview(
          productReview,
          appSettings,
          reviewToSave,
          false,
          ctx.vtex.storeUserAuthToken,
          logger
        )

        ctx.status = 200
        ctx.body = reviewResponse?.id ?? null

        return
      }

      case REVIEWS: {
        if (!isValidAdminUser) {
          ctx.status = 401
          ctx.body = null

          return
        }

        const reviews = bodyAsText as Review[]
        const ids: string[] = []

        for (const review of reviews) {
          if (review.verifiedPurchaser == null) {
            review.verifiedPurchaser = false
          }

          if (!review.productId) {
            ctx.status = 400
            ctx.body = 'ProductId is missing for one or more reviews.'

            return
          }

          if (review.rating == null) {
            ctx.status = 400
            ctx.body = 'Rating is missing for one or more reviews.'

            return
          }

          if (!review.title) {
            ctx.status = 400
            ctx.body = 'Title is missing for one or more reviews.'

            return
          }

          if (!review.text) {
            ctx.status = 400
            ctx.body = 'Text is missing for one or more reviews.'

            return
          }

          if (!review.reviewerName) {
            ctx.status = 400
            ctx.body = 'ReviewerName is missing for one or more reviews.'

            return
          }

          if (review.approved == null) {
            ctx.status = 400
            ctx.body = 'Approved is missing for one or more reviews.'

            return
          }
        }

        for (const review of reviews) {
          const reviewsResponse = await productReviewService.newReview(
            productReview,
            appSettings,
            review,
            false,
            ctx.vtex.storeUserAuthToken,
            logger
          )

          if (reviewsResponse?.id) {
            ids.push(reviewsResponse.id)
          }
        }

        ctx.status = 200
        ctx.body = ids

        return
      }

      default:
        break
    }
  } else if (method === 'delete') {
    let ids: string[]

    switch (requestedAction) {
      case REVIEW: {
        if (!isValidAdminUser) {
          ctx.status = 200
          ctx.body = 'Invalid User'

          return
        }

        if (!id) {
          ctx.status = 400
          ctx.body = 'Missing parameter.'

          return
        }

        ids = [id]
        ctx.status = 200
        ctx.body = await productReviewService.deleteReview(productReview, ids)

        return
      }

      case REVIEWS: {
        if (!isValidAdminUser) {
          ctx.status = 401
          ctx.body = null

          return
        }

        const bodyData = await json(ctx.req).catch(() => null)

        ids = bodyData as string[]
        ctx.status = 200
        ctx.body = await productReviewService.deleteReview(productReview, ids)

        return
      }

      default:
        break
    }
  } else if (method === 'patch') {
    switch (requestedAction) {
      case REVIEW: {
        if (!isValidAdminUser) {
          ctx.status = 200
          ctx.body = 'Invalid User'

          return
        }

        const bodyData = await json(ctx.req).catch(() => ({}))
        const review = bodyData as Review

        review.id = id ?? undefined

        ctx.status = 200
        ctx.body = await productReviewService.editReview(
          productReview,
          review
        )

        return
      }

      default:
        break
    }
  } else if (method === 'get') {
    const queryString = ctx.query
    const searchTerm = (queryString.search_term as string) || ''
    const fromParam = (queryString.from as string) || '0'
    const toParam = (queryString.to as string) || '3'
    const orderBy = (queryString.order_by as string) || ''
    const status = (queryString.status as string) || ''
    const productIdParam = (queryString.product_id as string) || ''
    const ratingQS = (queryString.rating as string) || ''
    const locale = (queryString.locale as string) || ''
    const pastReviewsQS = (queryString.pastReviews as string) || ''
    const pastReviews = pastReviewsQS === 'true'

    let rating = 0

    if (ratingQS) {
      rating = parseInt(ratingQS, 10) || 0
    }

    switch (requestedAction) {
      case REVIEW: {
        if (!id) {
          ctx.status = 400
          ctx.body = 'Missing parameter.'

          return
        }

        const review = await productReviewService.getReview(
          productReview,
          id
        )

        if (review && !isValidAdminUser) {
          review.shopperId = null
        }

        ctx.status = 200
        ctx.body = review

        return
      }

      case REVIEWS: {
        const from = parseInt(fromParam, 10)
        const to = parseInt(toParam, 10)

        let wrapper

        if (productIdParam) {
          wrapper = await productReviewService.getReviewsByProductIdFull(
            productReview,
            appSettings,
            productIdParam,
            from,
            to,
            orderBy,
            searchTerm,
            rating,
            locale,
            pastReviews,
            logger
          )
        } else {
          wrapper = await productReviewService.getReviews(
            productReview,
            searchTerm || null,
            from,
            to,
            orderBy || null,
            status || null,
            logger
          )
        }

        if (!isValidAdminUser && wrapper.reviews) {
          for (const r of wrapper.reviews) {
            r.shopperId = null
          }
        }

        const searchResponse: SearchResponse = {
          data: { data: wrapper.reviews } as DataElement,
          range: wrapper.range,
        }

        ctx.status = 200
        ctx.body = searchResponse

        return
      }

      case RATING: {
        const average = await productReviewService.getAverageRatingByProductId(
          productReview,
          appSettings,
          id ?? ''
        )

        const wrapper = await productReviewService.getReviewsByProductId(
          productReview,
          appSettings,
          id ?? '',
          logger
        )

        const ratingResponse: RatingResponse = {
          average: average.average,
          starsFive: average.starsFive,
          starsFour: average.starsFour,
          starsThree: average.starsThree,
          starsTwo: average.starsTwo,
          starsOne: average.starsOne,
          totalCount: wrapper.range.total,
        }

        ctx.status = 200
        ctx.body = ratingResponse

        return
      }

      default:
        break
    }
  }

  ctx.status = 200
  ctx.body = ''
}

export async function reviewApiAction(
  ctx: Context,
  next: () => Promise<void>
) {
  const { requestedAction } = ctx.vtex.route.params as {
    requestedAction: string
  }

  const id = (ctx.query.id as string) || null

  await processReviewApiAction(ctx, requestedAction, id)
  await next()
}

export async function reviewApiActionId(
  ctx: Context,
  next: () => Promise<void>
) {
  const params = ctx.vtex.route.params as {
    requestedAction: string
    id: string
  }

  await processReviewApiAction(ctx, params.requestedAction, params.id)
  await next()
}
