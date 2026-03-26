import { json } from 'co-body'
import type { ServiceContext, RecorderState, ParamsContext } from '@vtex/api'

import type { Clients } from '../clients'
import * as productReviewService from '../services/productReview'
import * as authorizationService from '../services/authorization'

type Context = ServiceContext<Clients, RecorderState, ParamsContext>

export async function migrateDataHandler(
  ctx: Context,
  next: () => Promise<void>
) {
  const { logger } = ctx.vtex
  const { productReview, appSettings, authorization } = ctx.clients
  let result = ''

  let isValidAdminUser = false
  const authenticatedUser =
    await authorizationService.retrieveAuthenticatedUser(
      authorization,
      ctx.headers,
      ctx.vtex.adminUserAuthToken,
      ctx.vtex.storeUserAuthToken,
      logger
    )

  if (authenticatedUser) {
    isValidAdminUser = await authorizationService.validateLicenseManagerAccess(
      authorization,
      authenticatedUser.id
    )
  }

  if (!isValidAdminUser) {
    ctx.status = 401
    ctx.body = 'Invalid User'
    await next()

    return
  }

  const method = ctx.method.toLowerCase()

  if (method === 'post') {
    try {
      const bodyData = await json(ctx.req)
      const productIds = bodyData as string[]

      result = await productReviewService.migrateDataByProductIds(
        productReview,
        appSettings,
        productIds,
        logger
      )
    } catch (err: any) {
      result = `Error migrating data ${err.message}`
    }
  } else if (method === 'get') {
    try {
      result = await productReviewService.migrateData(
        productReview,
        appSettings,
        logger
      )
    } catch (err: any) {
      result = `Error migrating data ${err.message}`
    }
  }

  ctx.status = 200
  ctx.body = result
  await next()
}
