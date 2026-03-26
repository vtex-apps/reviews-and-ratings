import type { ServiceContext, RecorderState, ParamsContext } from '@vtex/api'

import type { Clients } from '../clients'
import * as productReviewService from '../services/productReview'

type Context = ServiceContext<Clients, RecorderState, ParamsContext>

export async function addSearchDateHandler(
  ctx: Context,
  next: () => Promise<void>
) {
  try {
    await productReviewService.addSearchDate(ctx.clients.productReview)
    ctx.status = 200
    ctx.body = 'Done'
  } catch (_err: any) {
    ctx.status = 200
    ctx.body = 'False'
  }

  await next()
}
