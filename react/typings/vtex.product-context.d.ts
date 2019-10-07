declare module 'vtex.product-context' {
  import { Context } from 'react'

  export interface ProductContext {
    product: Product
  }

  export interface Product {
    productId: string
    productName: string
  }

  export const ProductContext = Context
}
