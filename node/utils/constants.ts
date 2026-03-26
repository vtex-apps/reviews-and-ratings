/**
 * Constants extracted from the C# codebase.
 * Corresponds to values from ProductReviewRepository.cs and other source files.
 */

export const DATA_ENTITY = 'productReviews'
export const SCHEMA = 'reviewsSchema'
export const REVIEWS_BUCKET = 'productReviews'
export const LOOKUP = 'productLookup'
export const HASHED_SCHEMA = 'HashedSchema'
export const SUCCESSFUL_MIGRATION = 'SuccessfulMigration'
export const APP_SETTINGS = 'vtex.reviews-and-ratings'
export const MAXIMUM_RETURNED_RECORDS = 500
export const DELIMITER = ':'
export const ENVIRONMENT = 'vtexcommercestable'

export const SCHEMA_JSON =
  '{"name":"reviewsSchema","properties":{"productId":{"type":"string","title":"productId"},"rating":{"type":["integer","null"],"title":"rating"},"title":{"type":["string","null"],"title":"title"},"text":{"type":["string","null"],"title":"text"},"reviewerName":{"type":["string","null"],"title":"reviewerName"},"shopperId":{"type":["string","null"],"title":"shopperId"},"reviewDateTime":{"type":"string","title":"reviewDateTime"},"searchDate":{"type":["string","null"],"title":"searchDate","format":"date-time"}, "verifiedPurchaser":{"type":"boolean","title":"verifiedPurchaser"},"sku":{"type":["string","null"],"title":"sku"},"approved":{"type":"boolean","title":"approved"},"location":{"type":["string","null"],"title":"location"},"locale":{"type":["string","null"],"title":"locale"}},"v-indexed":["productId","shopperId","approved","reviewDateTime","searchDate", "rating", "locale"],"v-security":{"allowGetAll":true},"v-immediate-indexing":true}'

/** Header names */
export const HEADER_VTEX_CREDENTIAL = 'X-Vtex-Credential'
export const HEADER_VTEX_WORKSPACE = 'X-Vtex-Workspace'
export const HEADER_VTEX_ACCOUNT = 'X-Vtex-Account'
export const HEADER_VTEX_APP_KEY = 'X-VTEX-API-AppKey'
export const HEADER_VTEX_APP_TOKEN = 'X-VTEX-API-AppToken'
export const VTEX_ID_HEADER_NAME = 'VtexIdclientAutCookie'
export const PROXY_AUTHORIZATION_HEADER_NAME = 'Proxy-Authorization'
export const USE_HTTPS_HEADER_NAME = 'X-Vtex-Use-Https'
export const FORWARDED_HOST = 'X-Forwarded-Host'

/** REST API action names */
export const REVIEW = 'review'
export const REVIEWS = 'reviews'
export const RATING = 'rating'
export const AUTH_SUCCESS = 'Success'
