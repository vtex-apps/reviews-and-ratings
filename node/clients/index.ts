import { IOClients } from '@vtex/api'

import { AppSettingsClient } from './appSettings'
import { AuthorizationClient } from './authorization'
import { ProductReviewClient } from './productReview'

export class Clients extends IOClients {
  public get productReview() {
    return this.getOrSet('productReview', ProductReviewClient)
  }

  public get authorization() {
    return this.getOrSet('authorization', AuthorizationClient)
  }

  public get appSettings() {
    return this.getOrSet('appSettings', AppSettingsClient)
  }
}
