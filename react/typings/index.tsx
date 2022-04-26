export interface Review {
  approved: boolean
  id: string
  productId: string
  rating: number
  locale: string | null
  title: string
  text: string
  location: string | null
  reviewerName: string
  reviewDateTime: string
  verifiedPurchaser: boolean
}
