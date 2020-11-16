
export const TOAST_DURATION_MS = 10000
export const REVIEW_COLUMN_WIDTH_PX = 202
export const PRODUCT_COLUMN_WIDTH_PX = 174
export const DATE_COLUMN_WIDTH_PX = 160

export const PENDING_REVIEWS_PAGE = 'admin.app.reviews.pending'
export const APPROVED_REVIEWS_PAGE = 'admin.app.reviews.approved'

export const displayLoading = () => {
  window.postMessage({ action: { type: 'START_LOADING' } }, '*')
}

export const stopLoading = () => {
  window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
}

export const getUserInfo = () => {
  return window.fetch('/api/vtexid/user/info?scope=').then(res => res.json())
}

declare global {
  interface Window {
    __RUNTIME__: {
      account: string
      workspace: string
    }
  }
}
