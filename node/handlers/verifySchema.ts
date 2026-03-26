import type { ServiceContext, RecorderState, ParamsContext } from '@vtex/api'

import type { Clients } from '../clients'
import * as productReviewService from '../services/productReview'

type Context = ServiceContext<Clients, RecorderState, ParamsContext>

export async function verifySchemaHandler(
  ctx: Context,
  next: () => Promise<void>
) {
  const result = await productReviewService.verifySchema(
    ctx.clients.productReview
  )

  ctx.status = 200
  ctx.body = result
  await next()
}
