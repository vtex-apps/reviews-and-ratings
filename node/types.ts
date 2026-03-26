/**
 * TypeScript interfaces converted from C# models in the dotnet/ folder.
 * Preserves JSON property names (camelCase) for API compatibility.
 */

export interface Review {
  id?: string
  productId: string
  rating?: number | null
  title?: string | null
  text?: string | null
  reviewerName?: string | null
  shopperId?: string | null
  reviewDateTime?: string | null
  searchDate?: string | null
  verifiedPurchaser?: boolean | null
  sku?: string | null
  approved?: boolean | null
  location?: string | null
  locale?: string | null
  pastReviews?: boolean | null
}

export interface LegacyReview {
  Id: number
  ProductId: string
  Rating?: number | null
  Title?: string | null
  Text?: string | null
  ReviewerName?: string | null
  ShopperId?: string | null
  ReviewDateTime?: string | null
  VerifiedPurchaser?: boolean | null
  Sku?: string | null
  Approved?: boolean | null
  Location?: string | null
  Locale?: string | null
  PastReviews?: boolean | null
}

export interface AppSettings {
  allowAnonymousReviews: boolean
  requireApproval: boolean
  useLocation: boolean
  defaultOpen: boolean
  defaultStarsRating: number
  defaultOpenCount: number
  showGraph: boolean
  displaySummaryIfNone: boolean
  displayInlineIfNone: boolean
  displaySummaryTotalReviews: boolean
  displaySummaryAddButton: boolean
}

export interface AverageCount {
  average: number
  starsFive: number
  starsFour: number
  starsThree: number
  starsTwo: number
  starsOne: number
  total: number
}

export interface RatingResponse {
  average: number
  starsFive: number
  starsFour: number
  starsThree: number
  starsTwo: number
  starsOne: number
  totalCount: number
}

export interface ReviewsResponseWrapper {
  reviews: Review[]
  range: SearchRange
}

export interface SearchResponse {
  data: DataElement
  range: SearchRange
}

export interface SearchRange {
  total: number
  from: number
  to: number
}

export interface DataElement {
  data: Review[]
}

export interface ValidateToken {
  Token: string
}

export interface ValidatedUser {
  authStatus: string
  id: string
  user: string
  account: string
  audience: string
  tokenType: string
}

export interface ValidateKeyAndToken {
  appKey: string
  appToken: string
}

export interface ValidatedKeyAndToken {
  authStatus: string
  token: string
  expires: string
}

export interface AppInstalledEvent {
  to: InstalledApp
}

export interface InstalledApp {
  id: string
  registry: string
}

/**
 * Simplified VtexOrder - only fields actually used in the code
 */
export interface VtexOrder {
  items: VtexOrderItem[]
}

export interface VtexOrderItem {
  productId: string
}

/**
 * Simplified VtexOrderList - only fields actually used in the code
 */
export interface VtexOrderList {
  list: VtexOrderListItem[]
}

export interface VtexOrderListItem {
  orderId: string
}
