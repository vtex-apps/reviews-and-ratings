import { ApolloError } from 'apollo-client'

export interface Review {
  id: string
  cacheId: string
  productId: string
  rating: number
  title: string
  text: string
  reviewerName: string
  shopperId: string
  location: string
  reviewDateTime: string
  verifiedPurchaser: boolean
  sku: string
  approved: boolean
}

export interface ReviewTableRowData {
  id: string
  shopperId: string
  productId: string
  sku?: string
  rating: number
  title: string
  text: string
  approved?: boolean
  reviewDateTime: string
}

export interface Product {
  productId: string
  sku?: string
}

export interface TabsTotalizersData {
  reviewsTotalizers: {
    pendingAmount: number
    acceptedAmount: number
  }
}

export interface SearchReviewArgs {
  searchTerm?: string
  from?: number
  to?: number
  status?: string
  orderBy?: string
}

interface Range {
  total: number
  from: number
  to: number
}
export interface SearchReviewData {
  reviews: {
    data: Review[]
    range: Range
  }
}

export interface QueryResults {
  loading: boolean
  error?: ApolloError
  data: Review[]
}

export interface SingleActionResponse {
  operation: string
  message: string
  details: string
  reviewId: string
  error?: string
}

export interface GenericActionResponse {
  totalTries: number
  partialError: number
  successes: SingleActionResponse[]
  errors: SingleActionResponse[]
}

export interface ApplyMatchData {
  actionResult: GenericActionResponse
}

export interface ApplyMatchVariables {
  id: string[]
  approved?: boolean
}

export interface ProcessingReviewData {
  processingReviews: {
    data: Review[]
    range: Range
  }
}

export interface ProcessingReviewSet {
  data: Review[]
  range?: Range
}

export interface ShowToastParams {
  message: string | JSX.Element
  duration: number
}

export interface ToastRenderProps {
  showToast: (params: ShowToastParams) => void
}
