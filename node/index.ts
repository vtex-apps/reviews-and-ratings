import type { ClientsConfig, RecorderState, ServiceContext, ParamsContext } from '@vtex/api'
import { Service, method } from '@vtex/api'

import { Clients } from './clients'
import {
  reviewApiAction,
  reviewApiActionId,
  verifySchemaHandler,
  migrateDataHandler,
  addSearchDateHandler,
  onAppsLinked,
} from './handlers'
import { queries, mutations } from './resolvers'

const TIMEOUT_MS = 10000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 0,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, RecorderState, ParamsContext>
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  routes: {
    reviewApiAction: method({
      GET: [reviewApiAction],
      POST: [reviewApiAction],
      DELETE: [reviewApiAction],
      PATCH: [reviewApiAction],
    }),
    reviewApiActionId: method({
      GET: [reviewApiActionId],
      POST: [reviewApiActionId],
      DELETE: [reviewApiActionId],
      PATCH: [reviewApiActionId],
    }),
    verifySchema: method({
      GET: [verifySchemaHandler],
    }),
    migrateData: method({
      GET: [migrateDataHandler],
      POST: [migrateDataHandler],
    }),
    addSearchDate: method({
      GET: [addSearchDateHandler],
    }),
  },
  events: {
    onAppsLinked,
  },
  graphql: {
    resolvers: {
      Query: queries,
      Mutation: mutations,
    },
  },
})
