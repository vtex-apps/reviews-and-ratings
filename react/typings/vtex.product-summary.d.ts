declare module 'vtex.product-summary' {
  import React from 'react'

  interface ProductSummary {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: any
  }

  export const ProductSummaryContext: React.Context
}
