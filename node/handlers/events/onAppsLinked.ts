import type { EventContext } from '@vtex/api'

import type { Clients } from '../../clients'
import type { AppInstalledEvent } from '../../types'
import * as productReviewService from '../../services/productReview'

export async function onAppsLinked(
  ctx: EventContext<Clients>,
  next: () => Promise<void>
) {
  const body = ctx.body as AppInstalledEvent | undefined

  if (body?.to?.id?.includes('vtex.reviews-and-ratings')) {
    await productReviewService.verifySchema(ctx.clients.productReview)
  }

  await next()
}
